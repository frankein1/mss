import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'

export const getUserController = async ({
  input: { id }
}: {
  input: { id: string }
}) => {
  const user = await prismaClient.user.findUnique({
    where: { id }
  })
  if (user) {
    return user
  }
  throw notfoundError()
}

export type AdminUserOutput = Prisma.PromiseReturnType<typeof getUserController>
