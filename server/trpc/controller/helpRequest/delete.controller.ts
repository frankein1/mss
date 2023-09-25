import { UserActivityType } from '@prisma/client'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { canDeleteHelpRequest } from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

function getHelpRequest(id: string) {
  return prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

export const deleteHelpRequestHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequest(id)

  if (!helpRequest) {
    throw invalidError('HelpRequest not found')
  }

  if (!canDeleteHelpRequest(user, helpRequest)) {
    throw forbiddenError()
  }

  await prismaClient.helpRequest.delete({ where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })
}
