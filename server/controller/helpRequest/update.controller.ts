import type { Prisma, User } from '@prisma/client'
import { AppContext, forbiddenError } from '~/server/trpc'
import type { EditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryHelpRequest } from '~/server/query/security/rules'
import { prepareHelpRequestData } from '~/utils/helpRequest/prepareHelpRequestData'

function getHelpRequest(id: string) {
  return prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true
    }
  })
}

type HelpRequestWithBeneficiaryAndDocuments = Prisma.PromiseReturnType<
  typeof getHelpRequest
>

async function updateTransaction(
  transaction: Prisma.TransactionClient,
  input: EditHelpRequestInput,
  user: User,
  target: Exclude<HelpRequestWithBeneficiaryAndDocuments, null>
) {
  const data = await prepareHelpRequestData({
    input,
    transaction,
    user,
    target
  })
  const helpRequest = await transaction.helpRequest.update({
    where: { id: input.id },
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })
  return { helpRequest }
}

export const updateHelpRequestHandler = async ({
  input,
  ctx: { user }
}: {
  input: EditHelpRequestInput
  ctx: AppContext
}) => {
  const target = await getHelpRequest(input.id)

  if (
    !target ||
    !canEditBeneficiaryHelpRequest(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, user, target)
  )
}
