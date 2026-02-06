import type { H3Event } from 'h3'
import { setAuthenticatedContext } from '~/server/auth/auth-middleware'

export const createContext = async (event: H3Event) => {
  await setAuthenticatedContext(event)
  const user = event.context.auth?.user

  if (!user) {
    return { event }
  }

  return { event, user }
}

export type AppContext = Awaited<ReturnType<typeof createContext>>
