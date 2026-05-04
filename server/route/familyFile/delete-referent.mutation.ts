import { UserActivityObject, UserActivityType, UserRole } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  validateBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import { invalidError, type ProtectedAppContext } from '~/server/trpc'
import {
  deleteReferentFromFamilyFileSchema,
  type DeleteReferentFromFamilyFileSchema
} from '~/server/schema'
import { FamilyFileRepo, UserRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DeleteReferentFromFamilyFileSchema
) => {
  // check User type
  if (ctx.user.role === UserRole.ReceptionAgent) {
    return false
  }
  // check if user belongs to structure
  const userIsInstructure = await validateBelongsToStructure(
    ctx.user,
    [input.referentId],
    UserRepo.count
  )
  if (!userIsInstructure) {
    return false
  }

  // check FamilyFile Permissions
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
    throw invalidError('Maximum number of beneficiaries exceeded')
  }

  const familyFileIds = input.beneficiaries.map(b => b.familyFileId)
  const familyFiles = await FamilyFileRepo.findMany(ctx.user, {
    where: { id: { in: familyFileIds } },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true }
      }
    }
  })

  if (familyFiles.some(ff => ff.referents.length < 2)) {
    throw invalidError('Family file must have, at least, 2 referent agents.')
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
