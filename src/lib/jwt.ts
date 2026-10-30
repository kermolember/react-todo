interface JWTPayload {
  exp?: number
}

const CLOCK_DRIFT_TOLERANCE = 60

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = normalized.length % 4
  const value = pad ? normalized + '='.repeat(4 - pad) : normalized
  return atob(value)
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    const payload = parts[1]
    if (!/^[A-Za-z0-9-_]+$/.test(payload)) return null
    return JSON.parse(base64UrlDecode(payload))
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload?.exp) return true
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp + CLOCK_DRIFT_TOLERANCE < currentTime
}

export function getTokenRemainingTime(token: string): number {
  const payload = decodeJWT(token)
  if (!payload?.exp) return 0
  const currentTime = Math.floor(Date.now() / 1000)
  return Math.max(0, payload.exp - currentTime + CLOCK_DRIFT_TOLERANCE)
}

export function shouldRefreshToken(token: string, thresholdSeconds = 300): boolean {
  const remaining = getTokenRemainingTime(token)
  return remaining > 0 && remaining <= thresholdSeconds
}
