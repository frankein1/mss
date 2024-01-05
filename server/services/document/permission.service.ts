import { getBeneficiarySecurityTarget } from '../beneficiary/getSecurityTarget.service'
import { DocumentRepo } from '~/server/database'
import { SecurityRuleContext, getDocumentPermissions } from '~/server/security'

export async function getUpdatePermissions(
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

export async function getCreatePermissions(
  ctx: SecurityRuleContext,
  beneficiaryId: string
) {
  const beneficiary = await getBeneficiarySecurityTarget(
    ctx.user,
    beneficiaryId
  )
  const permissions = getDocumentPermissions({
    ctx,
    beneficiary
  })
  return permissions
}
