import { UserRepo } from '~/server/database'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { signJwt, verifyJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import { JwtUser } from '~/types/user'
import { getAppContextPermissions } from '~/server/security'

function getUserFromAuthToken(event: ProtectedAppContext['event']) {
  const {
    public: {
      auth: { cookieKey }
    },
    auth: { jwtKey }
  } = useRuntimeConfig()

  const cookies = parseCookies(event)
  if (!cookies) {
    throw invalidError()
  }

  const sessionToken = cookies[cookieKey]
  if (!sessionToken) {
    throw invalidError()
  }

  let payload
  try {
    payload = verifyJwt(sessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, cookieKey)
    throw forbiddenError()
  }

  const { user: savedUser } = payload

  return savedUser as JwtUser
}

async function updateUserWithCGUVersion(id: string) {
  const {
    public: { cguVersion }
  } = useRuntimeConfig()

  return await UserRepo.prisma.update({
    where: { id },
    data: {
      CGUHistory: {
        create: {
          version: cguVersion
        }
      }
    },
    include: {
      structure: {
        select: {
          id: true,
          type: true
        }
      },
      CGUHistory: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  })
}

function updateContext(event: ProtectedAppContext['event'], user: JwtUser) {
  const {
    public: {
      auth: { cookieKey, tokenValidationInMinutes }
    },
    auth: { jwtKey }
  } = useRuntimeConfig()

  event.context.auth = { user }

  const sessionToken = signJwt(user, jwtKey, tokenValidationInMinutes)

  setCookie(
    event,
    cookieKey,
    sessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )
}

export async function acceptCGU({
  ctx: { user, event }
}: {
  ctx: ProtectedAppContext
}) {
  const formerJwtUser = getUserFromAuthToken(event)

  const updatedUser = await updateUserWithCGUVersion(user.id)

  const updatedJwtUser: JwtUser = {
    ...formerJwtUser,
    CGUHistoryVersion: updatedUser.CGUHistory[0].version
  }

  updateContext(event, updatedJwtUser)

  const { structure } = updatedUser
  const permissions = getAppContextPermissions({ user, structure })

  return { user: updatedJwtUser, permissions }
}
