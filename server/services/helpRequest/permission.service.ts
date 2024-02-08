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
      fileInstruction: {
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
      }
    }
  })
}

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<HelpRequestPermissions> {
  const helpRequest = await getHelpRequestSecurityTarget(ctx.user, id)
  const {
    fileInstruction: { socialSupport }
  } = helpRequest
  return getHelpRequestPermissions({
    ctx,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}

export async function getCreationPermissions(
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
