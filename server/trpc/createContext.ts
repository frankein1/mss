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

  try {
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
  } catch (err) {
    // FIXME: Remove log once error is identified
    console.error('[tRPC CreateContext] User not found...', { id: userData.id })
    throw err
  }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
