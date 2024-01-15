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
      socialSupport: {
        include: {
          beneficiary: {
            include: {
              referents: true
            }
          }
        }
      }
    }
  })
}

export async function getEditionPermissions(
  user: SecurityRuleGrantee,
  id: string
): Promise<FollowupPermissions> {
  const { socialSupport } = await getFollowupSecurityTarget(user, id)
  return getFollowupPermissions({
    user,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}

export async function getCreationPermissions(
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
