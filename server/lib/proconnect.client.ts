import type { JwtPayload } from 'jsonwebtoken'
import { routes, apiRoutes } from '~/utils/routes'

export type ProConnectToken = {
  accessToken: string
  expiresIn: number
  refreshToken: string
  tokenType: string
  idToken: string
  scope: string
}

export type ProConnectTokenResponse = {
  data?: ProConnectToken
  error?: {
    error: string
    description: string
  }
}

export type ProConnectConfig = {
  issuer: string
  clientId: string
  clientSecret: string
  redirectUri: string
  postLogoutRedirectUri: string
}

export type ProConnectUserInfo = JwtPayload & {
  email: string
  sub: string
  aud: string
  exp: number
  iat: number
  custom?: { email_verified: boolean }
}

export class ProConnectClient {
  private issuer: string
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private postLogoutRedirectUri: string

  public constructor({
    issuer,
    clientId,
    clientSecret,
    redirectUri,
    postLogoutRedirectUri
  }: ProConnectConfig) {
    this.issuer = issuer
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.postLogoutRedirectUri = postLogoutRedirectUri
  }

  public getRedirectUri(appRedirectUrl?: string) {
    if (!appRedirectUrl) {
      return this.redirectUri
    }
    const params = new URLSearchParams({ redirectUrl: appRedirectUrl })
    return `${this.redirectUri}?${params}`
  }

  public async getToken({
    code
  }: {
    code: string
    appRedirectUrl?: string
  }): Promise<ProConnectTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code
    })

    try {
      const response = await fetch(`${this.issuer}/token`, {
        method: 'post',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      const responseJson = await response.json()

      if (responseJson.error) {
        return {
          error: {
            error: responseJson.error,
            description: responseJson.error_description
          }
        }
      }

      const {
        access_token: accessToken,
        expires_in: expiresIn,
        token_type: tokenType,
        scope,
        refresh_token: refreshToken,
        id_token: idToken
      } = responseJson

      return {
        data: {
          accessToken,
          expiresIn,
          refreshToken,
          tokenType,
          idToken,
          scope
        }
      }
    } catch {
      return {
        error: {
          error: "Le chargement du jeton d'authentification a échoué",
          description: "Le chargement du jeton d'authentification a échoué"
        }
      }
    }
  }

  public async getUserInfo({
    accessToken
  }: {
    accessToken: string
  }): Promise<string> {
    const response = await fetch(`${this.issuer}/userinfo`, {
      method: 'post',
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    const jwt = await response.text()

    return jwt
  }

  public getSigninUrl(args: { nonce: string; state: string }) {
    const { nonce, state } = args
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: 'openid email siret custom',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      acr_values: 'eidas1',
      state,
      nonce,
      claims: JSON.stringify({
        id_token: {
          // retrieve authentication mode
          amr: { essential: true },
          // retrieve authentication timestamp
          auth_time: { essential: true }
          // acr: {
          //   essential: true
          //   value: 'https://proconnect.gouv.fr/assurance/self-asserted-2fa'
          // }
        }
      })
    })

    return `${this.issuer}/authorize?${params}`
  }

  public getLogoutUrl({ state, idToken }: { state: string; idToken: string }) {
    const params = new URLSearchParams({
      id_token_hint: idToken,
      state,
      post_logout_redirect_uri: this.postLogoutRedirectUri
    })
    return `${this.issuer}/session/end?${params}`
  }
}

let client: ProConnectClient

function initClient() {
  if (!client) {
    const {
      public: { appUrl },
      auth: { proconnectIssuer, proconnectClientId, proconnectClientSecret }
    } = useRuntimeConfig()
    const config = {
      issuer: proconnectIssuer,
      clientId: proconnectClientId,
      clientSecret: proconnectClientSecret,
      redirectUri: `${appUrl}${apiRoutes.proConnect.ApiSsoCallback.path()}`,
      postLogoutRedirectUri: `${appUrl}${routes.auth.AuthLogout.path()}`
    }
    client = new ProConnectClient(config)
  }
}

export function getProConnectClient() {
  if (!client) {
    initClient()
  }
  return client
}

export type ProConnectJwtData = {
  exp: number // 1681391044
  iat: number // 1681390744
  auth_time: number // 1681390744
  jti: string // '42586d65-8ed3-42e3-a6a4-365e1b369c5a'
  iss: string // 'http://localhost:8080/realms/local'
  aud: string // 'local_inclusion_connect'
  sub: string // 'e0a0260b-2a30-4fcd-a298-8344c11ee947'
  typ: string // 'ID'
  azp: string // 'local_inclusion_connect'
  nonce: string // 'nonce -521vn'
  session_state: string // '89054e83-e37d-459f-9315-6441e198d054'
  at_hash: string // '1ZhBditf2aGXmvyy87KXeQ'
  acr: string // '1'
  sid: string // '89054e83-e37d-459f-9315-6441e198d054'
  email_verified: boolean // true
  name: string // 'Jean Agent'
  preferred_username: string // 'jean.agent@yopmail.com'
  given_name: string // 'Jean'
  family_name: string // 'Agent'
  email: string // 'jean.agent@yopmail.com'
}

export const parseProConnectJwt = (token: string): ProConnectJwtData => {
  try {
    const end = token.split('.')?.[1]
    if (!end) {
      throw new Error()
    }
    return JSON.parse(Buffer.from(end, 'base64').toString())
  } catch {
    throw new Error('token is not parsable')
  }
}
