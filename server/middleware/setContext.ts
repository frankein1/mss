import { defineEventHandler, parseCookies, deleteCookie } from 'h3'
import { validateSession } from '~~/server/lib/session'
import { setUser } from '@sentry/node'

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      userId: string
    }
  }
}

export default defineEventHandler(async event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    setUser(null)
    return
  }
  const {
    auth: { sessionAbsoluteMaxMinutes },
    public: {
      auth: { cookieKey, tokenValidationInMinutes }
    }
  } = useRuntimeConfig()
  const sessionToken = cookies[cookieKey]
  if (!sessionToken) {
    setUser(null)
    return
  }

  const session = await validateSession(sessionToken, {
    slidingExpiryMinutes: tokenValidationInMinutes,
    absoluteMaxMinutes: sessionAbsoluteMaxMinutes
  })

  if (!session) {
    deleteCookie(event, cookieKey)
    setUser(null)
    return
  }

  event.context.auth = { userId: session.userId }
  setUser({ id: session.userId })
})
