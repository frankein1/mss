import { AppContext, invalidError } from '~/server/trpc'
import {
  AccompagnementsQuery,
  getBeneficiarySecurityTarget
} from '~/server/query'
import { AddFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'

export const addFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: AddFollowupInput
  ctx: AppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
  if (!target) {
    throw invalidError('Beneficiary not found')
  }
  return prismaClient.$transaction(transaction => {
    return AccompagnementsQuery.addFollowup({ input, transaction, user })
  })
}
