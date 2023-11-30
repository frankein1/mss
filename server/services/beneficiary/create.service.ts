import { Prisma } from '@prisma/client'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export async function create({
  user,
  params,
  draftId
}: {
  user: SecurityRuleGrantee
  params: Prisma.BeneficiaryCreateArgs
  draftId?: string
}) {
  const createdBeneficiary = await BeneficiaryRepo.prisma.create(params)

  if (draftId) {
    await DraftRepo.delete(user, {
      where: {
        id: draftId
      }
    })
  }

  return createdBeneficiary
}
