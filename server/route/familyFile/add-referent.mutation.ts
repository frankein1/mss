import { UserActivityObject, UserActivityType, UserRole } from '@prisma/client'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import { invalidError, type ProtectedAppContext } from '~/server/trpc'
import {
  transfertReferentToFamilyFileSchema,
  type TransferReferentToFamilyFileInput
} from '~/server/schema'
import { FamilyFileRepo, UserRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: TransferReferentToFamilyFileInput
) => {
  // check User type
  if (ctx.user.role === UserRole.ReceptionAgent) {
    return false
  }

  // check if user belongs to structure
  const userIsInstructure = await validateOneBelongsToStructure(
    ctx.user,
    input.referentId,
    UserRepo.findUnique
  )
  if (!userIsInstructure) {
    return false
  }

  // check FamilyFile Permissions
  const familyFileIds = [...new Set(input.familyFileIds)] // deduplicate
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
    const permissions = getFamilyFilePermissions({
      ctx,
      familyFile: familyFile
    })
    return permissions.changeReferent
  })
}

const handler = async ({
  input,
  ctx
}: {
  input: TransferReferentToFamilyFileInput
  ctx: ProtectedAppContext
}) => {
  if (input.familyFileIds.length > MAX_BENEFICIARIES_REFERENT_TRANSFER) {
    throw invalidError('Maximum number of beneficiaries exceeded')
  }
  const familyFileIds = [...new Set(input.familyFileIds)] // deduplicate
  return FamilyFileService.addReferentToFamilyFile({
    user: ctx.user,
    familyFileIds,
    referentId: input.referentId
  })
}

export const addReferentToFamilyFileMutation = createMutation({
  inputValidation: transfertReferentToFamilyFileSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'familyFile.addReferent',
    target: UserActivityObject.FamilyFile,
    targetId: ({ input }) => [...new Set(input.familyFileIds)].join(', '),
    action: UserActivityType.UPDATE
  }
})
