import { SocialSupportType } from '@prisma/client'
import { SocialSupportRepo } from '~/server/database'
import { SecurityRuleGrantee, SecurityRuleContext } from '~/server/security'
import {
  FollowupPermissions,
  getFollowupPermissions,
  getFileInstructionPermissions,
  getSocialSupportPermissions,
  FileInstructionPermissions
} from '~/server/security/permissions'
import { BeneficiaryService } from '~/server/services/beneficiary'

export function getSocialSupportSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return SocialSupportRepo.findUniqueOrThrow(user, {
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

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
) {
  const socialSupport = await getSocialSupportSecurityTarget(ctx.user, id)
  return getSocialSupportPermissions({
    ctx,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string,
  socialSupportType: 'Followup'
): Promise<FollowupPermissions>

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string,
  socialSupportType: 'HelpRequest'
): Promise<FileInstructionPermissions>

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string,
  socialSupportType: SocialSupportType
): Promise<FollowupPermissions | FileInstructionPermissions> {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    beneficiaryId
  )
  if (socialSupportType === 'Followup') {
    return getFollowupPermissions({
      ctx,
      beneficiary
    })
  }
  return getFileInstructionPermissions({ ctx, beneficiary })
}
