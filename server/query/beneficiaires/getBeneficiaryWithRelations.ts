import { BeneficiaryRepo } from '../../database/repository/BeneficiaryRepository'
import { BENEFICIARY_RELATIONS_INCLUDE } from '~/utils/constants/beneficiary'
import { SecurityRuleGrantee } from '~/server/security'

export async function getBeneficiaryWithRelations(
  user: SecurityRuleGrantee,
  id: string
) {
  return await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include: BENEFICIARY_RELATIONS_INCLUDE
  })
}
