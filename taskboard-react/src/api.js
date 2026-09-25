const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export async function api(path, { method = 'GET', body = {} } = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.message ?? 'Request failed.')
    error.status = response.status
    error.errors = data?.errors ?? {}
    throw error
  }

  return data
}
