import { UserActivityType, UserRole } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  type SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import {
  addReferentToBeneficiariesSchema,
  type AddReferentToBeneficiariesInput
} from '~/server/schema'
import { FamilyFileRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

export const MAX_BENEFICIARIES = 100

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddReferentToBeneficiariesInput
) => {
  // Test type de user
  if (
    ctx.user.role === UserRole.Administrator ||
    ctx.user.role === UserRole.ReceptionAgent
  ) {
    return false
  }

  // Nombre de bénéficiaire max
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

  // Test les permissions 'changeReferent' pour chaque beneficiaire
  // TODO: est-ce bloquant pour faire le batch? ou laisser faire le script et ignorer le bénéficiaire lorsque le droit n'est pas ok
  // car c'est assez flou pour l'utilisateur, il ne comprend pas pourquoi il se mange une erreur
  // TODO: lister les cas ou ceci peut arriver (à priori uniquement le rôle Referent)
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
  input: AddReferentToBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.addReferentToBeneficiaries({
    user: ctx.user,
    beneficiaries: input.beneficiaries,
    referentId: input.referentId
  })
}

export const addReferentToBeneficiariesMutation = createMutation({
  inputValidation: addReferentToBeneficiariesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.addReferent',
    target: 'Beneficiary',
    targetId: ({ input }) =>
      input.beneficiaries.map(b => b.beneficiaryId).join(', '),
    action: UserActivityType.UPDATE
  }
})
