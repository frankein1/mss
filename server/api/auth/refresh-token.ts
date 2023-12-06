import { H3Event } from 'h3'
import { signJwt, verifyJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'

export default defineEventHandler(event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    return sendNoContent(event, 401)
  }
  const config = useRuntimeConfig()

  const { cookieKey, tokenValidationDuration } = config.public.auth

  const sessionToken = cookies[cookieKey]

  if (!sessionToken) {
    return sendNoContent(event, 401)
  }

  const {
    auth: { jwtKey }
  } = config

  let payload
  try {
    payload = verifyJwt(sessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, cookieKey)
    return redirectLogOut(event)
  }

  const { user } = payload

  const newSessionToken = signJwt(user, jwtKey, tokenValidationDuration)

  setCookie(
    event,
    cookieKey,
    newSessionToken,
    cookieOptions({ expiresIn: tokenValidationDuration })
  )
})

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, 'api/keycloak/logout')
}
