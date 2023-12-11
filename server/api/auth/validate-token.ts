import { UserActivityType } from '@prisma/client'
import { signJwt } from '~/server/lib/jwt'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { JwtUser } from '~/types/user'
import { cookieOptions } from '~/utils/cookie'

export default defineEventHandler(async event => {
  const { token } = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Aucun jeton fourni. Merci de vous authentifier à nouveau.'
    })
  }

  const user = await UserRepo.prisma.findFirst({
    where: {
      accessToken: token,
      accessTokenValidity: {
        gte: new Date()
      }
    },
    include: {
      CGUHistory: true,
      structure: { select: { id: true, type: true } }
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      message:
        "Votre jeton n'est plus valide. Merci de vous authentifier à nouveau."
    })
  }

  const config = useRuntimeConfig()

  const {
    firstName,
    lastName,
    id,
    role,
    status,
    email,
    CGUHistory,
    structure
  } = user

  const CGUHistoryVersion = CGUHistory?.length ? CGUHistory[0].version : null

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    structureId: structure?.id || null,
    CGUHistoryVersion,
    structureType: structure?.type || null
  }

  const { sessionToken, expiresIn } = signJwt(jwtUser, config.auth.jwtKey)

  const sessionCookieKey = config.public.sessionCookieKey

  setCookie(event, sessionCookieKey, sessionToken, cookieOptions({ expiresIn }))

  await UserRepo.prisma.update({
    where: {
      id: user.id
    },
    data: {
      accessToken: null,
      accessTokenValidity: null,
      lastAccess: new Date()
    }
  })

  await addUserActivity({
    key: 'auth.validateToken',
    user,
    activity: UserActivityType.LOGIN,
    object: 'User',
    objectId: user.id
  })

  return { user: jwtUser }
})
