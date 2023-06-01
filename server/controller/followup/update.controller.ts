import type { Prisma, User } from '@prisma/client'
import { AppContext, forbiddenError } from '~/server/trpc'
import type { EditFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryFollowup } from '~/server/query/security/rules'
import { prepareFollowupData } from '~/utils/followup/prepareFollowupData'

function getFollowup(id: string) {
  return prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      types: true
    }
  })
}

type FollowupWithBeneficiaryDocumentsAndTypes = Prisma.PromiseReturnType<
  typeof getFollowup
>

async function updateTransaction(
  transaction: Prisma.TransactionClient,
  input: EditFollowupInput,
  user: User,
  target: Exclude<FollowupWithBeneficiaryDocumentsAndTypes, null>
) {
  const data = await prepareFollowupData({
    input,
    transaction,
    user,
    target
  })

  return await transaction.followup.update({
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
}

export const updateFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: EditFollowupInput
  ctx: AppContext
}) => {
  const target = await getFollowup(input.id)

  if (
    !target ||
    !canEditBeneficiaryFollowup(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return prismaClient.$transaction(transaction =>
    updateTransaction(transaction, input, user, target)
  )
}
