import { H3Event } from 'h3'
import { signJwt } from '~/server/lib/jwt'
import { JwtUser } from '~/types/user'
import { cookieOptions } from '~/utils/cookie'

export default defineEventHandler(event => {
  const user = event.context.auth?.user as JwtUser

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
  return user
})

function redirectLogOut(event: H3Event) {
  return sendRedirect(event, '/api/keycloak/logout')
}
