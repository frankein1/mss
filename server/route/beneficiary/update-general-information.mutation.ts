import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  type FamilyFilePermissions,
  type SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryGeneralInformationInput } from '~/server/schema'
import { updateBeneficiaryGeneralInformationSchema } from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )
  const permissions = getFamilyFilePermissions({
    ctx,
    familyFile: beneficiary.familyFile
  })

  if (!permissions.changeReferent) {
    const referentsInDb = new Set(
      beneficiary.familyFile.referents.map(r => r.id)
    )
    const newReferents = new Set(input.referents)
    const referentsAreUnchanged =
      newReferents.size === referentsInDb.size &&
      newReferents.isSubsetOf(referentsInDb)
    if (!referentsAreUnchanged) {
      return false
    }
  }
  return permissions.edit.general
}

function cleanInput(input: UpdateBeneficiaryGeneralInformationInput) {
  const { structureId: _structureId, referents: _referents, ...data } = input
  if (data.noPhone) {
    data.phone1 = null
    data.phone2 = null
  }

  return data
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  ctx: ProtectedAppContext
}) => {
  const { id, referents } = input
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )

  const cleaned = cleanInput(input)

  const {
    familyFile: { referents: previousReferents }
  } = target
  const previousReferentIds = previousReferents.map(({ id }) => id)
  const referentConnections = prepareRelationConnections(
    referents,
    previousReferentIds
  )

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    select: { id: true },
    where: { id },
    data: {
      ...cleaned,
      familyFile: {
        update: {
          data: {
            referents: referentConnections
          }
        }
      }
    }
  })

  return updatedBeneficiary
}

export const updateGeneralInformationMutation = createMutation({
  inputValidation: updateBeneficiaryGeneralInformationSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateGeneralInformation',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
