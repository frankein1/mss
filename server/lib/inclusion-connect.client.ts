import { generators } from 'openid-client'
import { RoutePath } from '~/utils/routing'

export type InclusionConnectToken = {
  accessToken: string
  expiresIn: number
  refreshExpiresIn: number
  refreshToken: string
  tokenType: string
  idToken: string
  sessionState: string
  scope: string
}

export type InclusionConnectTokenResponse = {
  data?: InclusionConnectToken
  error?: {
    error: string
    description: string
  }
}

export type InclusionConnectConfig = {
  issuer: string
  clientId: string
  clientSecret: string
  redirectUri: string
  postLogoutRedirectUri: string
}

export class InclusionConnectClient {
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
  }: InclusionConnectConfig) {
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
    code,
    appRedirectUrl
  }: {
    code: string
    appRedirectUrl?: string
  }): Promise<InclusionConnectTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: this.getRedirectUri(appRedirectUrl),
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code
    })

    const response = await fetch(
      `${this.issuer}/protocol/openid-connect/token`,
      {
        method: 'post',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )

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
      refresh_expires_in: refreshExpiresIn,
      refresh_token: refreshToken,
      token_type: tokenType,
      id_token: idToken,
      session_state: sessionState,
      scope
    } = responseJson

    return {
      data: {
        accessToken,
        expiresIn,
        refreshExpiresIn,
        refreshToken,
        tokenType,
        idToken,
        sessionState,
        scope
      }
    }
  }

  public getSigninUrl(appRedirectUrl?: string) {
    const codeVerifier = generators.codeVerifier()
    const codeChallenge = generators.codeChallenge(codeVerifier)

    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: 'openid profile email',
      response_type: 'code',
      redirect_uri: this.getRedirectUri(appRedirectUrl),
      state: codeChallenge,
      nonce: codeChallenge
      // code_challenge: codeChallenge,
      // code_challenge_method: 'S256'
    })
    return `${this.issuer}/protocol/openid-connect/auth?${params}`
  }

  public getLogoutUrl(sessionState: string, idToken: string) {
    const params = new URLSearchParams({
      state: sessionState || '',
      id_token_hint: idToken || '',
      post_logout_redirect_uri: `${this.postLogoutRedirectUri}`
    })
    return `${this.issuer}/protocol/openid-connect/logout?${params}`
  }

  public getPostLogoutRedirectUri() {
    return this.postLogoutRedirectUri
  }

  public getRegistrationUrl() {
    const inclusionConnectRegistration = `${this.issuer}/protocol/openid-connect/registrations`

    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: 'openid profile email',
      response_type: 'code',
      redirect_uri: this.redirectUri
    })

    return `${inclusionConnectRegistration}?${params}`
  }
}

let client: InclusionConnectClient

function initClient() {
  if (!client) {
    const {
      public: { appUrl },
      auth: { keycloakIssuer, keycloakClientId, keycloakClientSecret }
    } = useRuntimeConfig()
    const config = {
      issuer: keycloakIssuer,
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
      redirectUri: `${appUrl}${RoutePath.SsoCallback()}`,
      postLogoutRedirectUri: `${appUrl}${RoutePath.LogoutSuccess()}`
    }
    client = new InclusionConnectClient(config)
  }
}

export function getInclusionConnectClient() {
  if (!client) {
    initClient()
  }
  return client
}

export type InclusionConnectJwtData = {
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
  preferred_username: string // 'jean.agent@example.com'
  given_name: string // 'Jean'
  family_name: string // 'Agent'
  email: string // 'jean.agent@example.com'
}

export const parseInclusionConnectJwt = (
  token: string
): InclusionConnectJwtData => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (e) {
    throw new Error('token is not parsable')
  }
}
