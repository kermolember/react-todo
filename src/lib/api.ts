import { shouldRefreshToken } from '@/lib/jwt'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type AuthStateSnapshot = {
  token: string | null
  refreshToken: string | null
  isRefreshing: boolean
  refreshPromise: Promise<string> | null
}

type AuthContextBridge = {
  getState: () => AuthStateSnapshot
  startRefresh: () => Promise<string>
  logout: () => Promise<void> | void
}

let authBridge: AuthContextBridge | null = null

function buildUrl(url: string): string {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set')
  }
  return `${API_BASE_URL}${url}`
}

export function setApiAuthBridge(bridge: AuthContextBridge | null) {
  authBridge = bridge
}

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  skipAuth = false,
): Promise<Response> {
  const isAuthEndpoint =
    url === 'Account/RefreshToken' ||
    url === 'Account/Logout' ||
    url === 'Account/Login' ||
    url === 'Account/Register'

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (isAuthEndpoint) {
    return fetch(buildUrl(url), { ...options, headers })
  }

  const auth = authBridge
  const state = auth?.getState()

  if (!skipAuth && state?.token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${state.token}`)
  }

  const requestOptions: RequestInit = { ...options, headers }

  if (!skipAuth && state?.token && shouldRefreshToken(state.token)) {
    try {
      const refreshedToken = await auth?.startRefresh()
      if (refreshedToken) {
        headers.set('Authorization', `Bearer ${refreshedToken}`)
      }
    } catch (error) {
      await auth?.logout()
      throw error
    }
  }

  let response = await fetch(buildUrl(url), requestOptions)

  if (response.status === 401 && !skipAuth && auth?.getState().refreshToken) {
    try {
      const refreshedToken = await auth.startRefresh()
      if (refreshedToken) {
        headers.set('Authorization', `Bearer ${refreshedToken}`)
      }
      response = await fetch(buildUrl(url), { ...requestOptions, headers })
    } catch (error) {
      await auth?.logout()
      throw error
    }
  }

  return response
}
