import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { QuickEditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditHelpRequest } from '~/server/security/rules'
import { prepareGetHelpRequestsPageSelect } from '~/utils/helpRequest'

export const quickUpdateHelpRequestHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })

  if (!target || !canEditHelpRequest(user, target)) {
    throw forbiddenError()
  }

  const select = prepareGetHelpRequestsPageSelect(user)

  return await prismaClient.helpRequest.update({
    where: { id },
    data: rest,
    select
  })
}
