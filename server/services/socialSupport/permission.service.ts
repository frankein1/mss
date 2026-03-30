import { SocialSupportRepo } from '~/server/database'
import type {
  SecurityRuleGrantee,
  SecurityRuleContext
} from '~/server/security'
import { getSocialSupportPermissions } from '~/server/security/permissions'

function getSocialSupportSecurityTarget(user: SecurityRuleGrantee, id: string) {
  return SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      createdById: true,
      structureId: true,
      socialSupportType: true,
      familyFile: {
        select: {
          structureId: true,
          referents: { select: { id: true } }
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
