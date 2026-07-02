import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import {
  validateManyBelongToStructure,
  validatePartnerOrganizationIds
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'
import { updateBeneficiaryExternalOrganisationsSchema } from '~/server/schema'
import { BeneficiaryRepo, SupportProgramNameRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { prepareRelationUpdates } from '~/utils/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  if (!permissions.edit.externalOrganisations) {
    return false
  }

  const partnerOrgIds = input.supportPrograms.map(
    sp => sp.partnerOrganisationId
  )
  const supportProgramNameIds = input.supportPrograms.map(
    sp => sp.supportProgramNameId
  )

  const [partnerOrgValid, supportProgramNameValid] = await Promise.all([
    validatePartnerOrganizationIds(ctx.user, partnerOrgIds, []),
    validateManyBelongToStructure(
      ctx.user,
      supportProgramNameIds,
      SupportProgramNameRepo.count
    )
  ])

  return partnerOrgValid && supportProgramNameValid
}

function toSupportProgramData(
  sp: UpdateBeneficiaryExternalOrganisationsInput['supportPrograms'][number]
) {
  return {
    id: sp.id,
    startDate: sp.startDate ?? null,
    endDate: sp.endDate ?? null,
    precisions: sp.precisions ?? null,
    exitReason: sp.exitReason ?? null,
    supportProgramNameId: sp.supportProgramNameId,
    partnerOrganisationId: sp.partnerOrganisationId ?? null
  }
}

const handler = async ({
  ctx,
  input
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const { id, supportPrograms, ...externalOrganisations } = input

  const previousSupportPrograms = await BeneficiaryRepo.findUniqueOrThrow(
    ctx.user,
    {
      where: { id },
      select: { supportPrograms: { select: { id: true } } }
    }
  ).then(b => b.supportPrograms)

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    select: { id: true },
    where: { id },
    data: {
      ...externalOrganisations,
      supportPrograms: prepareRelationUpdates(
        supportPrograms.map(toSupportProgramData),
        previousSupportPrograms
      )
    }
  })

  return updatedBeneficiary
}

export const updateExternalOrganisationsMutation = createMutation({
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateExternalOrganisations',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
