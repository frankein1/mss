import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { parseCookies } from 'h3'
import { verifyJwt } from '../lib/jwt'
import { UnsafeUserRepo } from '~/server/database'

export const structureContextQuery = () => ({
  // FIXME: move 'externalRdvspActive' to the token
  select: { id: true, type: true, externalRdvspActive: true }
})

export const userContextQuery = () => ({
  select: { id: true, role: true, status: true }
})

export const createContext = async (event: H3Event) => {
  const config = useRuntimeConfig()

  const cookies = parseCookies(event)
  const { cookieKey } = config.public.auth

  const sessionToken = cookies[cookieKey]

  if (!sessionToken) {
    return { event }
  }

  const {
    auth: { jwtKey }
  } = config
  const { user: userData } = verifyJwt(sessionToken, jwtKey)

  try {
    // FIXME: remove this call & retrieve info directly from the token
    const user = await UnsafeUserRepo.prisma.findUniqueOrThrow({
      where: { id: userData.id },
      select: {
        ...userContextQuery().select,
        structure: structureContextQuery()
      }
    })

    return { event, user }
  } catch {
    return { event, user: null }
  }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
