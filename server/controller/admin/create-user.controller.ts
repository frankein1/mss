import { sendEmail } from '~/server/lib/email'
import { prismaClient } from '~/server/prisma'
import { AdminCreateUserInput } from '~/server/schema'
import { getEmailContent } from '~/utils/user/getEmailContent'

export const createUserController = async ({
  input
}: {
  input: AdminCreateUserInput
}) => {
  const createdUser = await prismaClient.user.create({
    data: input
  })

  sendEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social | Ouverture de votre compte',
    html: getEmailContent(createdUser)
  })

  return createdUser
}
