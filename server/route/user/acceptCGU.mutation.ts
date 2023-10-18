import { createMutation } from '../createRoute'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { signJwt, verifyJwt } from '~/server/lib/jwt'
import { cookieOptions } from '~/utils/cookie'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserRepo } from '~/server/database'

const handler = async ({
  ctx: { user, event }
}: {
  ctx: ProtectedAppContext
}) => {
  const {
    public: { cguVersion, sessionCookieKey },
    auth: { jwtKey }
  } = useRuntimeConfig()

  const updatedUser = await UserRepo.prisma.update({
    where: { id: user.id },
    data: {
      CGUHistory: {
        create: {
          version: cguVersion
        }
      }
    },
    include: {
      CGUHistory: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  })

  const cookies = parseCookies(event)
  if (!cookies) {
    throw invalidError()
  }

  const previousSessionToken = cookies[sessionCookieKey]
  if (!previousSessionToken) {
    throw invalidError()
  }

  let payload
  try {
    payload = verifyJwt(previousSessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, sessionCookieKey)
    throw forbiddenError()
  }

  const { user: savedUser } = payload

  const newUser = {
    ...savedUser,
    CGUHistoryVersion: updatedUser.CGUHistory[0].version
  }

  event.context.auth = { newUser }

  const { sessionToken, expiresIn } = signJwt(newUser, jwtKey)

  setCookie(event, sessionCookieKey, sessionToken, cookieOptions({ expiresIn }))

  return newUser
}

export const acceptCGUMutation = createMutation({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
