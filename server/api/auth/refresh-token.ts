import { H3Event } from 'h3'
import { signJwt, verifyJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'

export default defineEventHandler(event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    return sendNoContent(event, 401)
  }
  const config = useRuntimeConfig()

  const sessionCookieKey = config.public.sessionCookieKey

  const sessionToken = cookies[sessionCookieKey]

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
    deleteCookie(event, sessionCookieKey)
    return redirectLogOut(event)
  }

  const { user } = payload

  const { sessionToken: newSessionToken, expiresIn: newExpiresIn } = signJwt(
    user,
    jwtKey
  )

  setCookie(
    event,
    sessionCookieKey,
    newSessionToken,
    cookieOptions({ expiresIn: newExpiresIn })
  )
})

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, 'api/keycloak/logout')
}
