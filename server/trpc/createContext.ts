import { inferAsyncReturnType } from '@trpc/server'
import { H3Event, parseCookies } from 'h3'
import { verifyJwt } from '../lib/jwt'
import { UserRepo } from '~/server/database'

export const createContext = async (event: H3Event) => {
  const config = useRuntimeConfig()

  const cookies = parseCookies(event)
  const sessionCookieKey = config.public.sessionCookieKey

  const sessionToken = cookies[sessionCookieKey]

  if (!sessionToken) {
    return { event }
  }

  const {
    auth: { jwtKey }
  } = config
  const { user: userData } = verifyJwt(sessionToken, jwtKey)
  const user = await UserRepo.prisma.findUniqueOrThrow({
    where: { id: userData.id },
    select: {
      id: true,
      role: true,
      status: true,
      structure: {
        select: { id: true, type: true }
      }
    }
  })

  return { event, user }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
