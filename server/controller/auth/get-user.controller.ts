import { prismaClient } from '~/server/prisma'
import { AppContext, forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'

export const getUserController = async ({ ctx }: { ctx: AppContext }) => {
  const { user: ctxUser } = ctx

  if (!ctxUser) {
    throw forbiddenError()
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: ctxUser.id
    },
    include: {
      CGUHistory: true
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
    structureId
  } = user

  const CGUHistoryVersion = CGUHistory?.length ? CGUHistory[0].version : null

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    structureId,
    CGUHistoryVersion
  }

  return jwtUser
}
