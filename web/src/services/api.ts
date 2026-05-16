const API_BASE = '/api/v1/payments'

export interface InitTransactionRequest {
  buyOrder: string
  sessionId: string
  amount: number
}

export interface InitTransactionResponse {
  token: string
  url: string
}

export interface TransactionStatusResponse {
  buyOrder: string
  status: 'INITIALIZED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REFUNDED'
  amount: number
  createdAt: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  return res.json()
}

export function initiatePayment(data: InitTransactionRequest) {
  return request<InitTransactionResponse>('/initiate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getPaymentStatus(token: string) {
  return request<TransactionStatusResponse>(`/status?token=${encodeURIComponent(token)}`)
}

export function getRedirectUrl(token: string, url: string) {
  return `${API_BASE}/redirect?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}`
}
