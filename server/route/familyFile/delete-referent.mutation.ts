import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import {
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~~/server/security'
import { invalidError, type ProtectedAppContext } from '~~/server/trpc'
import {
  transfertReferentToFamilyFileSchema,
  type TransferReferentToFamilyFileInput
} from '~~/server/schema'
import { FamilyFileRepo, UserRepo } from '~~/server/database'
import { FamilyFileService } from '~~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: TransferReferentToFamilyFileInput
) => {
  const referentIsInStructure = await validateOneBelongsToStructure(
    ctx.user,
    input.referentId,
    UserRepo.findUnique
  )
  if (!referentIsInStructure) {
    return false
  }

  return FamilyFileService.validateCanChangeReferents(ctx, input.familyFileIds)
}

const handler = async ({
  input,
  ctx
}: {
  input: TransferReferentToFamilyFileInput
  ctx: ProtectedAppContext
}) => {
  const familyFileIds = [...new Set(input.familyFileIds)] // deduplicate

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
    familyFileIds,
    referentId: input.referentId
  })
}

export const deleteReferentFromFamilyFileMutation = createMutation({
  inputValidation: transfertReferentToFamilyFileSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'familyFile.deleteReferent',
    target: UserActivityObject.FamilyFile,
    targetId: ({ input }) => [...new Set(input.familyFileIds)].join(', '),
    action: UserActivityType.UPDATE
  }
})
