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
import { FamilyFileService } from '~/server/services'

export function getSocialSupportSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      familyFile: {
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
    familyFile: socialSupport.familyFile,
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
  familyFileId: string,
  socialSupportType: SocialSupportType
): Promise<FollowupPermissions | FileInstructionPermissions> {
  const familyFile = await FamilyFileService.getFamilyFileSecurityTarget(
    ctx.user,
    familyFileId
  )
  if (socialSupportType === 'Followup') {
    return getFollowupPermissions({
      ctx,
      familyFile
    })
  }
  return getFileInstructionPermissions({ ctx, familyFile })
}
