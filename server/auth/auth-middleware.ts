import { verifyJwt } from '~/server/lib/jwt'
import type { H3Event } from 'h3'
import { setUser } from '@sentry/node'
import { UserRepo } from '../database'
import { forbidden, unauthorized } from '~/utils/api/errors'

type UserSession = Awaited<ReturnType<typeof getMSSSession>>

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      user: UserSession
    }
  }
}

export const structureContextQuery = () => ({
  // FIXME: move 'externalRdvspActive' to the token
  select: { id: true, type: true, externalRdvspActive: true }
})

export const userContextQuery = () => ({
  select: { id: true, role: true, status: true, structureId: true }
})

export async function getMSSSession(event: H3Event) {
  const cookies = parseCookies(event)

  if (!cookies) {
    throw new Error('context: no cookies')
  }

  const config = useRuntimeConfig()
  const { cookieKey } = config.public.auth
  const sessionToken = cookies[cookieKey]

  if (!sessionToken) {
    throw new Error('context: no session token retrieved')
  }

  const { jwtKey } = config.auth

  const {
    user: { id }
  } = verifyJwt(sessionToken, jwtKey)

  const user = await UserRepo.prisma.findUniqueOrThrow({
    where: { id },
    select: {
      ...userContextQuery().select,
      structure: structureContextQuery()
    }
  })
  return user
}

export async function setAuthenticatedContext(event: H3Event) {
  try {
    console.log('middleware-auth: retrieving authed session')
    const user = await getMSSSession(event)

    setUser({ id: user.id })
    event.context.auth = { user }
  } catch (e) {
    console.log('middleware-auth: error in authed session retrieval', e)
    const config = useRuntimeConfig()
    const { cookieKey } = config.public.auth

    deleteCookie(event, cookieKey)
    setUser(null)
  }
}

export async function requireAuthenticationForNuxtRoute(event: H3Event) {
  console.log('requireAuthenticationForNuxtRoute')
  await setAuthenticatedContext(event)

  const user = event.context.auth?.user

  if (!user) {
    throw unauthorized('Not authenticated')
  }
  if (
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbidden('Not allowed to access route')
  }
}
