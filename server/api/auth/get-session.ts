import { UserRepo } from '~/server/database'
import { signJwt } from '~/server/lib/jwt'
import { getAppContextPermissions } from '~/server/security'
import type { JwtUser } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import {
  setAuthenticatedContext,
  structureContextQuery
} from '~/server/auth/auth-middleware'
import type { UserSession } from '~/types/auth'

export async function getUserAuthenticatedInfo(user: UserSession) {
  return await UserRepo.findUniqueOrThrow(user, {
    where: {
      id: user.id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      structure: structureContextQuery(),
      CGUHistory: {
        select: {
          version: true
        },
        orderBy: { date: 'desc' }
      }
    }
  })
}

/** Renew session using most recent user information from database
 *  and reissue a new auth token */
export default defineEventHandler({
  onRequest: [setAuthenticatedContext],
  handler: async event => {
    const authUser = event.context.auth?.user

    if (!authUser) {
      return null
    }

    const config = useRuntimeConfig()
    const { cookieKey, tokenValidationInMinutes } = config.public.auth

    const user = await getUserAuthenticatedInfo(authUser)

    if (!user) {
      return null
    }

    const jwtUser: JwtUser = { id: authUser.id }

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

    const permissions = getAppContextPermissions({
      user: {
        id: authUser.id,
        status: user.status,
        role: user.role,
        structureId: user.structure?.id || null
      },
      structure: user.structure
    })

    return { user, permissions }
  }
})
