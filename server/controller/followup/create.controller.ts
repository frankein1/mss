import type { Prisma, User } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import type { AddFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canCreateBeneficiaryFollowup } from '~/server/query/security/rules'
import { prepareFollowupData } from '~/utils/followup/prepareFollowupData'

function getBeneficiary(id: string) {
  return prismaClient.beneficiary.findUnique({
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: { select: { id: true } }
    }
  })
}

async function createTransaction(
  transaction: Prisma.TransactionClient,
  input: AddFollowupInput,
  user: User
) {
  const data = await prepareFollowupData({ input, transaction, user })

  return await transaction.followup.create({
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
}

export const addFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: AddFollowupInput
  ctx: AppContext
}) => {
  const beneficiary = await getBeneficiary(input.beneficiaryId)

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  if (!canCreateBeneficiaryFollowup(user, beneficiary)) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    createTransaction(transaction, input, user)
  )
}
