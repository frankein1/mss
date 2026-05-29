import { UserRepo } from '~/server/database'
import { signJwt } from '~/server/lib/jwt'
import { getAppContextPermissions } from '~/server/security'
import { cookieOptions } from '~/utils/cookie'
import { structureContextSelect } from '~/server/utils/fetchUserContext'

/** Renew session using most recent user information from database
 *  and reissue a new auth token */
export default defineEventHandler(async event => {
  const userId = event.context.auth?.userId

  const config = useRuntimeConfig()
  const { cookieKey, tokenValidationInMinutes } = config.public.auth

  if (!userId) {
    return null
  }

  const user = await UserRepo.prisma.findUnique({
    where: {
      id: userId
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
      email: true,
      role: true,
      status: true,
      structureId: true,
      CGUHistory: {
        orderBy: {
          date: 'desc' as const
        }
      },
      structure: { select: structureContextSelect }
    }
  })

  if (!user) {
    return null
  }

  const {
    auth: { jwtKey }
  } = config

  const newSessionToken = signJwt(
    { id: user.id },
    jwtKey,
    tokenValidationInMinutes
  )

  setCookie(
    event,
    cookieKey,
    newSessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )

  const CGUHistoryVersion = user.CGUHistory[0]?.version || null

  const userProfile = {
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    structureId: user.structure?.id || null,
    structureType: user.structure?.type || null,
    CGUHistoryVersion
  }

  const permissions = getAppContextPermissions({
    user,
    structure: user.structure
  })

  return { user: userProfile, permissions }
})
