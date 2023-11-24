import { AuthContext, forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { UserRepo } from '~/server/database'

export const getUserHandler = async ({
  ctx: { user: ctxUser }
}: {
  ctx: AuthContext
}) => {
  const user = await UserRepo.findUniqueOrThrow(ctxUser, {
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
