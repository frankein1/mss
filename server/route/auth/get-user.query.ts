import { createQuery } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserRepo } from '~/server/database'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  const { user: ctxUser } = ctx

  if (!ctxUser) {
    throw forbiddenError()
  }

  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id: ctxUser.id
    },
    include: {
      CGUHistory: true,
      structure: {
        select: {
          id: true,
          type: true
        }
      }
    }
  })

  if (!user) {
    throw forbiddenError()
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

  const CGUHistoryVersion = CGUHistory?.length ? CGUHistory[0].version : null

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

  return jwtUser
}

export const getUserQuery = createQuery({
  inputValidation: emptySchema,
  handler,
  securityCheck: AllowSecurityCheck
})
