import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const sessionCookieKey = config.public.sessionCookieKey
  const cookie = useCookie(sessionCookieKey)
  const store = useAuthStore()
  if (!cookie || !cookie.value) {
    return
  }
  const { user } = parseJwt(cookie.value)
  store.login(user)
})
