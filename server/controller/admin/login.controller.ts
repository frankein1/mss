import { UserRole } from '@prisma/client'
import { AdminLoginInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { forbiddenError, AppContext } from '~/server/trpc'
import { signJwt } from '~/server/lib/jwt'

export const loginController = async ({
  ctx,
  input
}: {
  ctx: AppContext
  input: AdminLoginInput
}) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: input.email
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

  setCookie(ctx.event, sessionCookieKey, sessionToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000)
  })
  return { user }
}
