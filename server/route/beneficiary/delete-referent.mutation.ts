import { UserActivityType, UserRole } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  type SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import {
  removeReferentFromBeneficiariesSchema,
  type RemoveReferentFromBeneficiariesInput
} from '~/server/schema'
import { FamilyFileRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { MAX_BENEFICIARIES } from './add-referent.mutation'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: RemoveReferentFromBeneficiariesInput
) => {
  if (
    ctx.user.role === UserRole.Administrator ||
    ctx.user.role === UserRole.ReceptionAgent
  ) {
    return false
  }

  if (input.beneficiaries.length > MAX_BENEFICIARIES) {
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
  input: RemoveReferentFromBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.removeReferentFromBeneficiaries({
    user: ctx.user,
    beneficiaries: input.beneficiaries,
    referentId: input.referentId
  })
}

export const removeReferentFromBeneficiariesMutation = createMutation({
  inputValidation: removeReferentFromBeneficiariesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.removeReferent',
    target: 'Beneficiary',
    targetId: ({ input }) =>
      input.beneficiaries.map(b => b.beneficiaryId).join(', '),
    action: UserActivityType.UPDATE
  }
})
