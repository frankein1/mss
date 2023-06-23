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
    }
  })

  if (!user) {
    throw forbiddenError()
  }

  const { firstName, lastName, id, role, status, email } = user

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    inclusionConnectId: '',
    structureId: ''
  }

  return jwtUser
}
