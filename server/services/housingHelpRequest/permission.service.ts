import { HousingHelpRequestRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import {
  HelpRequestPermissions,
  getHelpRequestPermissions
} from '~/server/security/permissions'

function getHousingHelpRequestSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
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
): Promise<HelpRequestPermissions> {
  const housingHelpRequest = await getHousingHelpRequestSecurityTarget(
    ctx.user,
    id
  )
  const { socialSupport } = housingHelpRequest
  return getHelpRequestPermissions({
    ctx,
    beneficiary: socialSupport.beneficiary,
    socialSupport
  })
}
