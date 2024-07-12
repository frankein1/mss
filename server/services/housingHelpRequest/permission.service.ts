import { HousingHelpRequestRepo } from '~/server/database'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import {
  FileInstructionPermissions,
  getFileInstructionPermissions
} from '~/server/security/permissions'

function getHousingHelpRequestSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      fileInstruction: {
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
      }
    }
  })
}

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<FileInstructionPermissions> {
  const housingHelpRequest = await getHousingHelpRequestSecurityTarget(
    ctx.user,
    id
  )
  const {
    fileInstruction: { socialSupport }
  } = housingHelpRequest
  return getFileInstructionPermissions({
    ctx,
    familyFile: socialSupport.familyFile,
    socialSupport
  })
}
