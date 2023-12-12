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
    public: {
      cguVersion,
      auth: { cookieKey, tokenValidationInMinutes }
    },
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

  const previousSessionToken = cookies[cookieKey]
  if (!previousSessionToken) {
    throw invalidError()
  }

  let payload
  try {
    payload = verifyJwt(previousSessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, cookieKey)
    throw forbiddenError()
  }

  const { user: savedUser } = payload

  const newUser = {
    ...savedUser,
    CGUHistoryVersion: updatedUser.CGUHistory[0].version
  }

  event.context.auth = { newUser }

  const sessionToken = signJwt(newUser, jwtKey, tokenValidationInMinutes)

  setCookie(
    event,
    cookieKey,
    sessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )

  return newUser
}

export const acceptCGUMutation = createMutation({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
