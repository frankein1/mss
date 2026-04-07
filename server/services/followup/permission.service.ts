import { FollowupRepo } from '~/server/database'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import type { FollowupPermissions } from '~/server/security/permissions'
import { getFollowupPermissions } from '~/server/security/permissions'

export function getFollowupSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      socialSupport: {
        select: {
          structureId: true,
          createdById: true,
          familyFile: {
            select: {
              structureId: true,
              referents: {
                select: { id: true }
              }
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
