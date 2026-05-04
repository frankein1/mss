import { UserActivityObject, UserActivityType, UserRole } from '@prisma/client'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  validateBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import { invalidError, type ProtectedAppContext } from '~/server/trpc'
import {
  addReferentToFamilyFileSchema,
  type AddReferentToFamilyFileInput
} from '~/server/schema'
import { FamilyFileRepo, UserRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'
import { TRPCError } from '@trpc/server'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddReferentToFamilyFileInput
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
  input: AddReferentToFamilyFileInput
  ctx: ProtectedAppContext
}) => {
  if (input.beneficiaries.length > MAX_BENEFICIARIES_REFERENT_TRANSFER) {
    throw invalidError('Maximum number of beneficiaries exceeded')
  }
  return FamilyFileService.addReferentToFamilyFile({
    user: ctx.user,
    beneficiaries: input.beneficiaries,
    referentId: input.referentId
  })
}

export const addReferentToFamilyFileMutation = createMutation({
  inputValidation: addReferentToFamilyFileSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'familyFile.addReferent',
    target: UserActivityObject.FamilyFile,
    targetId: ({ input }) =>
      input.beneficiaries.map(b => b.familyFileId).join(', '),
    action: UserActivityType.UPDATE
  }
})
