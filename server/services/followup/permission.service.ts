import { FollowupRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import {
  FollowupPermissions,
  getFollowupPermissions
} from '~/server/security/permissions'
import { FamilyFileService } from '~/server/services/familyFile'

export function getFollowupSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      socialSupport: {
        include: {
          familyFile: {
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
    familyFile: socialSupport.familyFile,
    socialSupport
  })
}

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  familyFileId: string
): Promise<FollowupPermissions> {
  const familyFile = await FamilyFileService.getFamilyFileSecurityTarget(
    ctx.user,
    familyFileId
  )
  return getFollowupPermissions({
    ctx,
    familyFile
  })
}
