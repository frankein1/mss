import { BeneficiaryRepo } from '~/server/database/repository'
import { SecurityRuleGrantee } from '~/server/security/rules'

export function getBeneficiarySecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, status: true, structureId: true }
      }
    }
  })
}
