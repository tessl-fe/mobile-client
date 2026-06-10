import Constants from 'expo-constants'
import { saveTokens, getAccessToken, getRefreshToken } from './auth'

const BACKEND = (Constants.expoConfig?.extra?.backendUrl as string | undefined) ?? 'http://localhost:3001'
const DATA = (Constants.expoConfig?.extra?.dataUrl as string | undefined) ?? 'http://localhost:3002'

export interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  apiKeys?: ApiKey[]
}

export interface ApiKey {
  id: string
  key: string
  label: string
  projectId: string
  createdAt: string
}

export interface MetricBucket {
  date: string
  count: number
}

export interface MetricsResponse {
  projectId: string
  buckets: MetricBucket[]
}

async function http<T>(url: string, init?: RequestInit, retry = true): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    }
  })

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh()
    if (refreshed) return http<T>(url, init, false)
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

async function tryRefresh(): Promise<boolean> {
  const token = await getRefreshToken()
  if (!token) return false
  try {
    const res = await fetch(`${BACKEND}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token })
    })
    if (!res.ok) return false
    const { accessToken, refreshToken } = await res.json()
    await saveTokens(accessToken, refreshToken ?? token)
    return true
  } catch {
    return false
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      http<{ accessToken: string; refreshToken: string }>(`${BACKEND}/auth/login`, {
        method: 'POST', body: JSON.stringify({ email, password })
      }),
    register: (email: string, password: string) =>
      http<{ accessToken: string; refreshToken: string }>(`${BACKEND}/auth/register`, {
        method: 'POST', body: JSON.stringify({ email, password })
      })
  },
  projects: {
    list: () => http<Project[]>(`${BACKEND}/projects`),
    get: (id: string) => http<Project>(`${BACKEND}/projects/${id}`)
  },
  metrics: {
    get: (projectId: string) =>
      http<MetricsResponse>(`${DATA}/metrics?projectId=${encodeURIComponent(projectId)}`)
  }
}
