import { Prisma, StructureType } from '@prisma/client'
import { columnsSelection, filter, find } from './helpers'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export async function findBeneficiaries({
  user,
  structure,
  where,
  orderBy
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  where: Prisma.BeneficiaryWhereInput
  orderBy:
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput[]
}) {
  const beneficiaries =
    (await BeneficiaryRepo.findMany(user, {
      include: columnsSelection,
      where,
      orderBy
    })) || []

  return beneficiaries.map(beneficiary =>
    filter({ user, beneficiary, structure })
  )
}

export async function findBeneficiary({
  user,
  structure,
  id
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  id: string
}) {
  const beneficiary = await find(user, id)
  return filter({ user, beneficiary, structure })
}
