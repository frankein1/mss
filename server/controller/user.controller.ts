import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const getUserInfoHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  if (!user) {
    throw invalidError('SessionUser is null')
  }
  return await prismaClient.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { structure: true }
  })
}
