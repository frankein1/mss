import { UserRepo } from '~/server/database'
import { signJwt } from '~/server/lib/jwt'
import { getAppContextPermissions } from '~/server/security'
import type { JwtUser } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import { includeOrderedCGUHistory } from '~/server/query'
import { structureContextQuery } from '~/server/trpc/createContext'

/** Renew session using most recent user information from database
 *  and reissue a new auth token */
export default defineEventHandler(async event => {
  const authUser = event.context.auth?.user

  const config = useRuntimeConfig()
  const { cookieKey, tokenValidationInMinutes } = config.public.auth

  if (!authUser) {
    return null
  }

  const user = await UserRepo.findUniqueOrThrow(authUser, {
    where: {
      id: authUser.id
    },
    include: {
      ...includeOrderedCGUHistory(),
      structure: structureContextQuery()
    }
  })

  if (!user) {
    return null
  }

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

  const CGUHistoryVersion = CGUHistory[0]?.version || null

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    structureId: structure?.id || null,
    structureType: structure?.type || null,
    CGUHistoryVersion
  }

  const {
    auth: { jwtKey }
  } = config

  const newSessionToken = signJwt(jwtUser, jwtKey, tokenValidationInMinutes)

  setCookie(
    event,
    cookieKey,
    newSessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )

  const permissions = getAppContextPermissions({ user, structure })

  return { user: jwtUser, permissions }
})
