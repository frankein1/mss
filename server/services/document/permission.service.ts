import { FamilyFileService } from '..'
import { DocumentRepo } from '~/server/database'
import { SecurityRuleContext, getDocumentPermissions } from '~/server/security'

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  key: string
) {
  const document = await DocumentRepo.findUniqueOrThrow(ctx.user, {
    where: { key },
    include: {
      familyFile: {
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
    familyFile: document.familyFile,
    document
  })
  return {
    document,
    permissions
  }
}

export async function getCreationPermissions(
  ctx: SecurityRuleContext,
  familyFileId: string
) {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    familyFileId
  )
  return permissions.create.document
}
