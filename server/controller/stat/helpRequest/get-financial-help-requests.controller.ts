import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export const getFinancialHelpRequestsStats = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.helpRequest.findMany({
    where: {
      structureId: user.structureId,
      financialSupport: true,
      ...prepareHelpRequestStatFilters(input)
    },
    select: {
      allocatedAmount: true,
      externalStructure: true,
      type: {
        select: {
          id: true,
          name: true
        }
      },
      status: true
    }
  })
}
