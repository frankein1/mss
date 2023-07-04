import { prismaClient } from '~/server/prisma'
import { AdminCreateUserInput } from '~/server/schema'

export const createUserController = async ({
  input
}: {
  input: AdminCreateUserInput
}) => {
  const createdUser = await prismaClient.user.create({
    data: input
  })

  return createdUser
}
