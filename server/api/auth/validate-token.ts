import { Prisma, UserActivityType, UserStatus } from '@prisma/client'
import { signJwt } from '~/server/lib/jwt'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { getAppContextPermissions } from '~/server/security'
import { JwtUser } from '~/types/user'
import { cookieOptions } from '~/utils/cookie'
import { includeOrderedCGUHistory } from '~/server/query'
import { structureContextQuery } from '~/server/trpc/createContext'

const config = useRuntimeConfig()

const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })
const forbidden = (message: string) => createError({ statusCode: 403, message })

export default defineEventHandler(async event => {
  const { token } = await readBody(event)

  if (!token) {
    throw unauthorized('No token found')
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
      structure: {
        select: {
          ...structureContextQuery().select,
          disabled: true
        }
      }
    }
  })

  if (!user) {
    throw unauthorized('Invalid token')
  }

  if (user.status !== UserStatus.Active) {
    throw forbidden('Deactivated user')
  }

  if (user.structure && user.structure.disabled) {
    throw forbidden('Deactivated structure')
  }

  const {
    firstName,
    lastName,
    id,
    role,
    status,
    email,
    CGUHistory,
    structure,
    firstAccess
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
    ...(!firstAccess && { firstAccess: new Date() }),
    lastAccess: new Date()
  }

  if (user.structure) {
    data.structure = {
      update: {
        lastAccess: new Date(),
        deactivationAlertEmail: 0,
        deactivationAlertEmailDate: null
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
