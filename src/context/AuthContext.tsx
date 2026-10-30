'use client'

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest, setApiAuthBridge } from '@/lib/api'
import { isTokenExpired } from '@/lib/jwt'
import type { JwtResponse, Login, Message, RefreshTokenModel, Register } from '@/types/api'

type User = { firstName?: string; lastName?: string } | null

function clearStoredAuth() {
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_refresh_token')
  sessionStorage.removeItem('auth_user')
}

function parseStoredUser(storedUser: string | null): { user: User; isInvalid: boolean } {
  if (!storedUser) return { user: null, isInvalid: false }

  try {
    const parsed = JSON.parse(storedUser)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { user: null, isInvalid: true }
    }

    const candidate = parsed as { firstName?: unknown; lastName?: unknown }
    return {
      user: {
        firstName: typeof candidate.firstName === 'string' ? candidate.firstName : undefined,
        lastName: typeof candidate.lastName === 'string' ? candidate.lastName : undefined,
      },
      isInvalid: false,
    }
  } catch {
    return { user: null, isInvalid: true }
  }
}

type AuthContextValue = {
  token: string | null
  refreshToken: string | null
  user: User
  isAuthenticated: boolean
  isHydrated: boolean
  isRefreshing: boolean
  refreshPromise: Promise<string> | null
  login: (credentials: Login) => Promise<JwtResponse>
  register: (userData: Register) => Promise<JwtResponse>
  refreshTokenFn: () => Promise<string>
  startRefresh: () => Promise<string>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [user, setUser] = useState<User>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshPromise, setRefreshPromise] = useState<Promise<string> | null>(null)
  const tokenRef = useRef<string | null>(null)
  const refreshTokenRef = useRef<string | null>(null)
  const userRef = useRef<User>(null)
  const refreshPromiseRef = useRef<Promise<string> | null>(null)

  const setAuthData = useCallback((data: JwtResponse) => {
    const nextToken = data.token || null
    const nextRefresh = data.refreshToken || null
    const nextUser = {
      firstName: data.firstName || userRef.current?.firstName,
      lastName: data.lastName || userRef.current?.lastName,
    }

    tokenRef.current = nextToken
    refreshTokenRef.current = nextRefresh
    userRef.current = nextUser
    setToken(nextToken)
    setRefreshToken(nextRefresh)
    setUser(nextUser)

    if (nextToken) {
      sessionStorage.setItem('auth_token', nextToken)
    } else {
      sessionStorage.removeItem('auth_token')
    }

    if (nextRefresh) {
      sessionStorage.setItem('auth_refresh_token', nextRefresh)
    } else {
      sessionStorage.removeItem('auth_refresh_token')
    }

    sessionStorage.setItem('auth_user', JSON.stringify(nextUser))
    return nextToken
  }, [])

  const logout = useCallback(async () => {
    refreshPromiseRef.current = null
    setIsRefreshing(false)
    setRefreshPromise(null)

    const currentRefresh = refreshTokenRef.current || sessionStorage.getItem('auth_refresh_token')
    if (currentRefresh) {
      try {
        await apiRequest(
          'Account/Logout',
          {
            method: 'POST',
            body: JSON.stringify({ refreshToken: currentRefresh }),
          },
          false,
        )
      } catch {
        // continue local logout
      }
    }

    tokenRef.current = null
    refreshTokenRef.current = null
    userRef.current = null
    setToken(null)
    setRefreshToken(null)
    setUser(null)
    clearStoredAuth()
  }, [])

  const refreshTokenFn = useCallback(async () => {
    const currentRefresh = sessionStorage.getItem('auth_refresh_token')
    const currentToken = sessionStorage.getItem('auth_token')

    if (!currentRefresh) {
      throw new Error('No refresh token available')
    }

    const payload: RefreshTokenModel = {
      jwt: currentToken || '',
      refreshToken: currentRefresh,
    }

    const response = await apiRequest(
      'Account/RefreshToken',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      true,
    )

    if (!response.ok) {
      await logout()
      throw new Error('Token refresh failed')
    }

    const data: JwtResponse = await response.json()
    const nextToken = setAuthData(data)
    if (!nextToken) {
      await logout()
      throw new Error('Token refresh failed')
    }

    return nextToken
  }, [logout, setAuthData])

  const startRefresh = useCallback(() => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current

    setIsRefreshing(true)
    const promise = refreshTokenFn().finally(() => {
      refreshPromiseRef.current = null
      setIsRefreshing(false)
      setRefreshPromise(null)
    })
    refreshPromiseRef.current = promise
    setRefreshPromise(promise)
    return promise
  }, [refreshTokenFn])

  const login = useCallback(
    async (credentials: Login) => {
      const response = await apiRequest(
        'Account/Login',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        },
        true,
      )

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data: JwtResponse = await response.json()
      setAuthData(data)
      return data
    },
    [setAuthData],
  )

  const register = useCallback(
    async (userData: Register) => {
      const response = await apiRequest(
        'Account/Register',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        },
        true,
      )

      if (!response.ok) {
        const errorText = await response.text()
        let message = 'Registration failed'
        try {
          const parsed: Message = JSON.parse(errorText)
          if (parsed.messages?.length) {
            message = parsed.messages.join(', ')
          }
        } catch {
          // keep default message
        }
        throw new Error(message)
      }

      const data: JwtResponse = await response.json()
      setAuthData(data)
      return data
    },
    [setAuthData],
  )

  useEffect(() => {
    const storedToken = sessionStorage.getItem('auth_token')
    const storedRefresh = sessionStorage.getItem('auth_refresh_token')
    const { user: storedUser, isInvalid: isStoredUserInvalid } = parseStoredUser(
      sessionStorage.getItem('auth_user'),
    )

    const clearHydratedAuth = () => {
      clearStoredAuth()
      tokenRef.current = null
      refreshTokenRef.current = null
      userRef.current = null
      setToken(null)
      setRefreshToken(null)
      setUser(null)
      setIsHydrated(true)
    }

    if (isStoredUserInvalid || !storedToken || !storedRefresh) {
      queueMicrotask(clearHydratedAuth)
      return
    }

    tokenRef.current = storedToken
    refreshTokenRef.current = storedRefresh
    userRef.current = storedUser

    if (isTokenExpired(storedToken)) {
      queueMicrotask(() => {
        refreshTokenFn()
          .catch(() => undefined)
          .finally(() => setIsHydrated(true))
      })
      return
    }

    queueMicrotask(() => {
      setToken(storedToken)
      setRefreshToken(storedRefresh)
      setUser(storedUser)
      setIsHydrated(true)
    })
  }, [refreshTokenFn])

  useEffect(() => {
    setApiAuthBridge({
      getState: () => ({
        token: tokenRef.current,
        refreshToken: refreshTokenRef.current,
        isRefreshing,
        refreshPromise,
      }),
      startRefresh,
      logout,
    })
    return () => setApiAuthBridge(null)
  }, [isRefreshing, refreshPromise, startRefresh, logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      refreshToken,
      user,
      isAuthenticated: !!token,
      isHydrated,
      isRefreshing,
      refreshPromise,
      login,
      register,
      refreshTokenFn,
      startRefresh,
      logout,
    }),
    [
      token,
      refreshToken,
      user,
      isHydrated,
      isRefreshing,
      refreshPromise,
      login,
      register,
      refreshTokenFn,
      startRefresh,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
