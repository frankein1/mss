import { H3Event } from 'h3'
import { signJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import { apiRoutes } from '~/utils/routes'

/** Regenerate a new session token using the information
 * from the former token. This does not fetch
 * the latest user information from the database
 */
export default defineEventHandler(event => {
  const user = event.context.auth?.user

  const config = useRuntimeConfig()
  const { cookieKey, tokenValidationInMinutes } = config.public.auth

  if (!user) {
    deleteCookie(event, cookieKey)
    return redirectLogOut(event)
  }

  const {
    auth: { jwtKey }
  } = config

  const newSessionToken = signJwt(user, jwtKey, tokenValidationInMinutes)

  setCookie(
    event,
    cookieKey,
    newSessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )
  return { user }
})

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, apiRoutes.proConnect.ApiLogout.path())
}
