import { HelpRequestRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import {
  HelpRequestPermissions,
  getHelpRequestPermissions
} from '~/server/security/permissions'
import { BeneficiaryService } from '~/server/services/beneficiary'

function getHelpRequestSecurityTarget(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
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

export async function getUpdatePermission(
  ctx: SecurityRuleContext,
  id: string
): Promise<HelpRequestPermissions> {
  const helpRequest = await getHelpRequestSecurityTarget(ctx.user, id)
  const { socialSupport } = helpRequest
  return getHelpRequestPermissions({
    ctx,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}

export async function getCreatePermission(
  ctx: SecurityRuleContext,
  beneficiaryId: string
): Promise<HelpRequestPermissions> {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    beneficiaryId
  )
  return getHelpRequestPermissions({
    ctx,
    beneficiary
  })
}
