import { HelpRequestRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import {
  HelpRequestPermissions,
  getHelpRequestPermissions
} from '~/server/security/permissions'

function getHelpRequestSecurityTarget(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
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
  ctx: SecurityRuleContext,
  id: string
): Promise<HelpRequestPermissions> {
  const helpRequest = await getHelpRequestSecurityTarget(ctx.user, id)
  return getHelpRequestPermissions({
    ctx,
    target: { beneficiary: helpRequest.beneficiary, helpRequest }
  })
}

export function getCreatePermission(
  ctx: SecurityRuleContext
): Promise<HelpRequestPermissions> {
  return Promise.resolve(
    getHelpRequestPermissions({
      ctx
    })
  )
}
