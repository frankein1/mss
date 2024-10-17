export interface AuthSession {
  nonce: string
  state: string
  redirectUrl?: string
}
