import { inferAsyncReturnType } from '@trpc/server'
import { H3Event, parseCookies } from 'h3'
import { verifyJwt } from '../lib/jwt'
import { prismaClient } from '@/server/prisma'

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
  const user = await prismaClient.user.findUnique({
    where: { id: userData.id }
  })

  return { event, user }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
