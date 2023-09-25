import { prismaClient } from '~/server/prisma'
import { AdminEditUserInput } from '~/server/schema'

export const editUserController = async ({
  input
}: {
  input: AdminEditUserInput
}) => {
  const { id, ...user } = input

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: user
  })

  return updatedUser
}
