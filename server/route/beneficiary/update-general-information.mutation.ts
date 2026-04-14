import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type {
  FamilyFilePermissions,
  SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryGeneralInformationInput } from '~/server/schema'
import { updateBeneficiaryGeneralInformationSchema } from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { forbiddenError } from '~/server/trpc/trpcErrors'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  if (!permissions.changeReferent) {
    await changeReferentSecurity(ctx, input, permissions)
  }
  return permissions.edit.general
}

const changeReferentSecurity = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryGeneralInformationInput,
  permissions: FamilyFilePermissions
) => {
  if (!permissions.changeReferent) {
    const target = await BeneficiaryService.getBeneficiarySecurityTarget(
      ctx.user,
      input.id
    )
    const existingReferentIds = target.familyFile.referents
      .map(({ id }) => id)
      .sort()
    const inputReferentIds = [...input.referents].sort()

    const referentsChanged =
      existingReferentIds.length !== inputReferentIds.length ||
      existingReferentIds.some((id, i) => id !== inputReferentIds[i])

    if (referentsChanged) {
      throw forbiddenError()
    }
  }
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
