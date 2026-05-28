import type { H3Event } from 'h3'
import { signJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import { apiRoutes } from '~/utils/routes'

export default defineEventHandler(event => {
  const userId = event.context.auth?.userId

  const config = useRuntimeConfig()
  const { cookieKey, tokenValidationInMinutes } = config.public.auth

  if (!userId) {
    deleteCookie(event, cookieKey)
    return redirectLogOut(event)
  }

  const {
    auth: { jwtKey }
  } = config

  const newSessionToken = signJwt({ id: userId }, jwtKey, tokenValidationInMinutes)

  setCookie(
    event,
    cookieKey,
    newSessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )
  return {}
})

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, apiRoutes.proConnect.ApiLogout.path())
}
