import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { fetchUserContext } from '~/server/utils/fetchUserContext'

export const createContext = async (event: H3Event) => {
  const userId = event.context.auth?.userId

  if (!userId) {
    return { event }
  }

  try {
    const user = await fetchUserContext(userId)
    return { event, user }
  } catch {
    return { event, user: null }
  }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
