import { verifyJwt } from '~~/server/lib/jwt'
import { setUser } from '@sentry/node'

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      userId: string
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

  event.context.auth = { userId: user.id }
  setUser({ id: user.id })
})
