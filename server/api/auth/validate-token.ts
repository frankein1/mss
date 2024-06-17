import { Prisma, UserActivityType } from '@prisma/client'
import { signJwt } from '~/server/lib/jwt'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { getAppContextPermissions } from '~/server/security'
import { JwtUser } from '~/types/user'
import { cookieOptions } from '~/utils/cookie'
import { includeOrderedCGUHistory } from '~/server/query'

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
      ...includeOrderedCGUHistory(),
      structure: { select: { id: true, type: true, disable: true } }
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      message:
        "Votre jeton n'est plus valide. Merci de vous authentifier à nouveau."
    })
  }

  if (user.structure && user.structure.disable) {
    throw createError({
      statusCode: 400,
      message: 'Structure désactivée'
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

  const { jwtKey } = config.auth
  const { cookieKey, tokenValidationInMinutes } = config.public.auth

  const sessionToken = signJwt(jwtUser, jwtKey, tokenValidationInMinutes)

  const data: Prisma.UserUpdateInput = {
    accessToken: null,
    accessTokenValidity: null,
    lastAccess: new Date()
  }

  if (user.structure) {
    data.structure = {
      update: {
        lastAccess: new Date()
      }
    }
  }

  await UserRepo.prisma.update({
    where: {
      id: user.id
    },
    data
  })

  setCookie(
    event,
    cookieKey,
    sessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )

  await addUserActivity({
    key: 'auth.validateToken',
    user,
    activity: UserActivityType.LOGIN,
    object: 'User',
    objectId: user.id
  })

  const permissions = getAppContextPermissions({ user, structure })

  return {
    user: jwtUser,
    permissions
  }
})
