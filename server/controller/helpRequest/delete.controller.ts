import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { canDeleteHelpRequest } from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'

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
}
