import { env } from '@/lib/env'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
  searchParams?: Record<string, any>
}

const ENTITY_ERROR_STATUS = 422

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }
    const res = await fetch(`${env.NEXT_PUBLIC_API_ENDPOINT}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken: localStorage.getItem('refresh_token') })
    })
    if (res.status !== 200) throw new Error('Refresh failed')
    const data = await res.json()
    if (!data.data.access_token || typeof data.data.access_token !== 'string') {
      throw new Error('No access token received')
    }
    const newAccessToken = data.data.access_token
    localStorage.setItem('access_token', newAccessToken)
    return newAccessToken
  } catch (err) {
    throw err
  }
}

export const isClient = () => typeof window !== 'undefined'
const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options?: CustomOptions | undefined,
  retry = true
): Promise<{ status: number; payload: Response }> => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: Record<string, string> = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient()) {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      baseHeaders.Authorization = `Bearer ${access_token}`
    }
  }

  const baseUrl = options?.baseUrl === undefined ? env.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
  const params = options?.searchParams ? new URLSearchParams(options.searchParams).toString() : ''
  const fullUrl = `${url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`}${params ? `?${params}` : ''}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as any,
    body,
    method
  })

  const payload: Response = await res.json()
  const data = { status: res.status, payload }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data as { status: 422; payload: EntityErrorPayload })
    }

    if (res.status === 401 && retry && isClient()) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newToken = await refreshAccessToken()
          onRefreshed(newToken)
          isRefreshing = false
        } catch (err) {
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/vi/login'
          throw err
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken: string) => {
          options = options || {}
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          }

          request<Response>(method, url, options, false).then(resolve).catch(reject)
        })
      })
    }

    throw new HttpError(data)
  }

  return data
}

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  },
  patch<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PATCH', url, { ...options, body })
  }
}

export default http
