import { FollowupRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
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
  ctx: SecurityRuleContext,
  id: string
): Promise<FollowupPermissions> {
  const { socialSupport } = await getFollowupSecurityTarget(ctx.user, id)
  return getFollowupPermissions({
    ctx,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string
): Promise<FollowupPermissions> {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    beneficiaryId
  )
  return getFollowupPermissions({
    ctx,
    beneficiary
  })
}
