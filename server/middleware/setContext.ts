import { verifyJwt } from '~/server/lib/jwt'
import type { JwtUser } from '~/server/lib/jwt'
import { setUser } from '@sentry/node'

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      user: JwtUser
    }
  }
}

export default defineEventHandler(event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    setUser(null)
    return
  }
  const config = useRuntimeConfig()
  const { cookieKey } = config.public.auth
  const sessionToken = cookies[cookieKey]
  if (!sessionToken) {
    setUser(null)
    return
  }
  const {
    auth: { jwtKey }
  } = config

  let payload
  try {
    payload = verifyJwt(sessionToken, jwtKey)
  } catch {
    deleteCookie(event, cookieKey)
    setUser(null)
    return
  }

  const { user } = payload

  event.context.auth = { user }
  setUser({ id: user.id })
})
