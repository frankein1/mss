import { signJwt } from '~/server/lib/jwt'
import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'

export default defineEventHandler(async event => {
  const { token } = await readBody(event)

  if (!token) {
    throw forbiddenError()
  }

  const user = await prismaClient.user.findFirst({
    where: {
      accessToken: token
    },
    include: {
      CGUHistory: true
    }
  })

  if (!user) {
    throw forbiddenError()
  }

  const config = useRuntimeConfig()

  const { firstName, lastName, id, role, status, email, CGUHistory } = user

  const CGUHistoryVersion = CGUHistory?.length ? CGUHistory[0].version : null

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    inclusionConnectId: '',
    structureId: '',
    CGUHistoryVersion
  }

  const { sessionToken, expiresIn } = signJwt(jwtUser, config.auth.jwtKey)

  const sessionCookieKey = config.public.sessionCookieKey

  setCookie(event, sessionCookieKey, sessionToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000)
  })

  return user
})
