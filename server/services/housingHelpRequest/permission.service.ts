import { HousingHelpRequestRepo } from '~/server/database'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import type { FileInstructionPermissions } from '~/server/security/permissions'
import { getFileInstructionPermissions } from '~/server/security/permissions'

function getHousingHelpRequestSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return HousingHelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      fileInstruction: {
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
