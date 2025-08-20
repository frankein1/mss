import { HelpRequestRepo } from '~/server/database'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import type { FileInstructionPermissions } from '~/server/security/permissions'
import { getFileInstructionPermissions } from '~/server/security/permissions'

function getHelpRequestSecurityTarget(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      fileInstruction: {
        include: {
          socialSupport: {
            include: {
              familyFile: {
                include: {
                  referents: true,
                  beneficiaries: true
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
  const helpRequest = await getHelpRequestSecurityTarget(ctx.user, id)
  const {
    fileInstruction: { socialSupport }
  } = helpRequest
  return getFileInstructionPermissions({
    ctx,
    familyFile: socialSupport.familyFile,
    socialSupport
  })
}
