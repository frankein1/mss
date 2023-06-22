import { UserRole } from '@prisma/client'
import { signJwt } from '~/server/lib/jwt'
import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { RoutePath } from '~/utils/routing'

export default defineEventHandler(async event => {
  const { email: input } = await readBody(event)

  const user = await prismaClient.user.findUnique({
    where: {
      email: input
    }
  })
  if (!user) {
    throw forbiddenError()
  }
  if (user.role !== UserRole.Administrator) {
    throw forbiddenError()
  }

  const config = useRuntimeConfig()

  const { firstName, lastName, id, role, status, email } = user

  const jwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    inclusionConnectId: '',
    structureId: ''
  }

  const { sessionToken, expiresIn } = signJwt(jwtUser, config.auth.jwtKey)

  const sessionCookieKey = config.public.sessionCookieKey

  setCookie(event, sessionCookieKey, sessionToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000)
  })
  return sendRedirect(event, RoutePath.AdminStructures())
})
