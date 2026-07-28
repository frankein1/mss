import { randomUUID } from 'crypto'
import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import { validatePartnerOrganizationIds } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'
import { updateBeneficiaryExternalOrganisationsSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
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

  const orgIds: (string | null | undefined)[] = [
    input.prescribingOrganizationId
  ]
  const contactIds: (string | null | undefined)[] = [
    input.prescribingOrganizationContactId
  ]
  if (input.contributingPartners.length) {
    orgIds.push(...input.contributingPartners.map(p => p.partnerOrganizationId))
    contactIds.push(
      ...input.contributingPartners.map(p => p.partnerOrganizationContactId)
    )
  }

  return validatePartnerOrganizationIds(ctx.user, orgIds, contactIds)
}

const handler = async ({
  input
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const {
    id,
    contributingPartners,
    prescribingOrganizationId,
    prescribingOrganizationContactId,
    ...scalarFields
  } = input

  const current = await BeneficiaryRepo.prisma.findUniqueOrThrow({
    where: { id },
    select: {
      prescribingStructure: true,
      involvedPartners: true,
      serviceProviders: true,
      contributingPartners: { select: { id: true } }
    }
  })

  const legacyNulls: Record<string, null> = {}

  if (prescribingOrganizationId && current.prescribingStructure) {
    legacyNulls.prescribingStructure = null
  }

  const hadNoContributingPartners = current.contributingPartners.length === 0
  if (hadNoContributingPartners && contributingPartners.length > 0) {
    if (current.involvedPartners) {
      legacyNulls.involvedPartners = null
    }
    if (current.serviceProviders) {
      legacyNulls.serviceProviders = null
    }
  }

  const preparedPartners = contributingPartners.map(p => ({
    id: p.id || randomUUID(),
    partnerOrganizationId: p.partnerOrganizationId,
    partnerOrganizationContactId: p.partnerOrganizationContactId || null,
    precisions: p.precisions || null
  }))

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    select: { id: true },
    where: { id },
    data: {
      ...scalarFields,
      ...legacyNulls,
      prescribingOrganizationId: prescribingOrganizationId || null,
      prescribingOrganizationContactId:
        prescribingOrganizationContactId || null,
      contributingPartners: prepareRelationUpdates(
        preparedPartners,
        current.contributingPartners
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
