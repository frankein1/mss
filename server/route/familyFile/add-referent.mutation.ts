import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import {
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~~/server/security'
import type { ProtectedAppContext } from '~~/server/trpc'
import {
  transfertReferentToFamilyFileSchema,
  type TransferReferentToFamilyFileInput
} from '~~/server/schema'
import { UserRepo } from '~~/server/database'
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
