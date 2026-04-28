import { UserActivityObject, UserActivityType, UserRole } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  type SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import {
  deleteReferentFromFamilyFileSchema,
  type DeleteReferentFromFamilyFileSchema
} from '~/server/schema'
import { FamilyFileRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
import { TRPCError } from '@trpc/server'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DeleteReferentFromFamilyFileSchema
) => {
  if (ctx.user.role === UserRole.ReceptionAgent) {
    return false
  }

  const familyFileIds = input.beneficiaries.map(b => b.familyFileId)

  const familyFiles = await FamilyFileRepo.findMany(ctx.user, {
    where: { id: { in: familyFileIds } },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, status: true, structureId: true }
      }
    }
  })

  // Refuse si au moins un fichier famille n'aurait plus aucun référent après suppression
  // TODO: interdire la selection en front
  if (familyFiles.some(ff => ff.referents.length <= 1)) {
    return false
  }

  return familyFiles.every(familyFile => {
    const permissions = getFamilyFilePermissions({ ctx, familyFile })
    return permissions.changeReferent
  })
}

const handler = async ({
  input,
  ctx
}: {
  input: DeleteReferentFromFamilyFileSchema
  ctx: ProtectedAppContext
}) => {
  if (input.beneficiaries.length > MAX_BENEFICIARIES_REFERENT_TRANSFER) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Over max beneficiaries'
    })
  }

  return FamilyFileService.deleteReferentFromFamilyfile({
    user: ctx.user,
    beneficiaries: input.beneficiaries,
    referentId: input.referentId
  })
}

export const deleteReferentFromFamilyFileMutation = createMutation({
  inputValidation: deleteReferentFromFamilyFileSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'familyFile.deleteReferent',
    target: UserActivityObject.FamilyFile,
    targetId: ({ input }) =>
      input.beneficiaries.map(b => b.familyFileId).join(', '),
    action: UserActivityType.UPDATE
  }
})
