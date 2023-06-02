import type { Prisma, User } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import type { CreateHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canCreateBeneficiaryHelpRequest } from '~/server/query/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/query/security'
import { prepareHelpRequestData } from '~/utils/helpRequest/prepareHelpRequestData'

const createTransaction = async (
  transaction: Prisma.TransactionClient,
  input: CreateHelpRequestInput,
  user: User
) => {
  const data = await prepareHelpRequestData({ input, transaction, user })

  const helpRequest = await transaction.helpRequest.create({
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

export const addHelpRequestHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateHelpRequestInput
  ctx: AppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!target) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateBeneficiaryHelpRequest(user, target)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction => {
    return createTransaction(transaction, input, user)
  })
}
