import type { H3Event } from 'h3'
import { requireAuthenticated } from '~/server/auth/auth-middleware'

export const createContext = async (event: H3Event) => {
  await requireAuthenticated(event)
  const user = event.context.auth?.user

  if (!user) {
    return { event }
  }

  return { event, user }
}

export type AppContext = Awaited<ReturnType<typeof createContext>>
