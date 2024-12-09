export interface AuthSession {
  nonce: string
  state: string
  redirectUrl?: string
}

export interface RdvspAuthSession {
  nonce: string
  state: string
  metadata: any
}
