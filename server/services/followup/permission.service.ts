import { FollowupRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import {
  FollowupPermissions,
  getFollowupPermissions
} from '~/server/security/permissions'
import { BeneficiaryService } from '~/server/services/beneficiary'

export function getFollowupSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

export async function getUpdatePermission(
  user: SecurityRuleGrantee,
  id: string
): Promise<FollowupPermissions> {
  const target = await getFollowupSecurityTarget(user, id)
  return getFollowupPermissions({
    user,
    beneficiary: target.beneficiary,
    followup: target
  })
}

export async function getCreatePermission(
  user: SecurityRuleGrantee,
  beneficiaryId: string
): Promise<FollowupPermissions> {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    beneficiaryId
  )
  return getFollowupPermissions({
    user,
    beneficiary
  })
}
