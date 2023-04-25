import { parseJwt } from '~/utils/parseJwt'

export function useAuthUser() {
  const config = useRuntimeConfig()
  const sessionCookieKey = config.public.sessionCookieKey
  const cookie = useCookie(sessionCookieKey)
  if (!cookie || !cookie.value) {
    return null
  }
  const { user } = parseJwt(cookie.value)

  return user
}
