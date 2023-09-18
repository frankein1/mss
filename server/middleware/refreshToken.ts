import { H3Event } from 'h3'
import { signJwt, verifyJwt } from '../lib/jwt'
import { cookieOptions } from '~/utils/cookie'

export default defineEventHandler(event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    return
  }
  const config = useRuntimeConfig()

  const sessionCookieKey = config.public.sessionCookieKey

  const sessionToken = cookies[sessionCookieKey]

  if (!sessionToken) {
    return
  }

  const {
    auth: { jwtKey },
    public: { inactiveUserTimeThreshold }
  } = config

  let payload
  try {
    payload = verifyJwt(sessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, sessionCookieKey)
    return redirectLogOut(event)
  }

  const { user, exp } = payload

  event.context.auth = { user }

  if (exp && expiredInLess(exp, inactiveUserTimeThreshold)) {
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
  }
})

function expiredInLess(expInSeconds: number, delayInMinutes: number) {
  return expInSeconds * 1000 - new Date().getTime() < delayInMinutes * 60 * 1000
}

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, 'api/keycloak/logout')
}
