import { Prisma } from '@prisma/client'
import { columnsSelection, filter, find } from './helpers'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'

export async function findBeneficiaries({
  ctx,
  where,
  orderBy
}: {
  ctx: SecurityRuleContext
  where: Prisma.BeneficiaryWhereInput
  orderBy:
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput[]
}) {
  const beneficiaries =
    (await BeneficiaryRepo.findMany(ctx.user, {
      include: columnsSelection,
      where,
      orderBy
    })) || []

  return beneficiaries.map(beneficiary => filter({ ctx, beneficiary }))
}

export async function findBeneficiary({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  const beneficiary = await find(ctx.user, id)
  return filter({ ctx, beneficiary })
}
