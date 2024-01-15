import { BeneficiaryService } from '../beneficiary'
import { DocumentRepo } from '~/server/database'
import { SecurityRuleContext, getDocumentPermissions } from '~/server/security'

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  key: string
) {
  const document = await DocumentRepo.findUniqueOrThrow(ctx.user, {
    where: { key },
    include: {
      beneficiary: {
        select: {
          id: true,
          structureId: true,
          referents: { select: { id: true } }
        }
      }
    }
  })
  const permissions = getDocumentPermissions({
    ctx,
    beneficiary: document.beneficiary,
    document
  })
  return {
    document,
    permissions
  }
}

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string
) {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    beneficiaryId
  )
  return permissions.create.document
}
