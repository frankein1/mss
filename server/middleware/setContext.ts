import { verifyJwt } from '~/server/lib/jwt'

export default defineEventHandler(event => {
  const cookies = parseCookies(event)
  if (!cookies) {
    return
  }
  const config = useRuntimeConfig()
  const { cookieKey } = config.public.auth
  const sessionToken = cookies[cookieKey]
  if (!sessionToken) {
    return
  }
  const {
    auth: { jwtKey }
  } = config

  let payload
  try {
    payload = verifyJwt(sessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, cookieKey)
    return
  }

  const { user } = payload

  event.context.auth = { user }
})
