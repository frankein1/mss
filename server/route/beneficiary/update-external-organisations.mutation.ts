import { randomUUID } from 'crypto'
import { UserActivityType, type Beneficiary } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import { validatePartnerOrganizationIds } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'
import { updateBeneficiaryExternalOrganisationsSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { prepareRelationUpdates } from '~/utils/prisma'
import { validateBeneficiaryPartnerOrganisations } from '../helpers'

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

  return validateBeneficiaryPartnerOrganisations(ctx.user, input)
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

  const nullableLegacyFields = nullifyLegacyFieldsIfPartnersAreFilled(
    contributingPartners,
    prescribingOrganizationId,
    current
  )

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
      ...nullableLegacyFields,
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

function nullifyLegacyFieldsIfPartnersAreFilled(
  contributingPartners: UpdateBeneficiaryExternalOrganisationsInput['contributingPartners'],
  prescribingOrganizationId: UpdateBeneficiaryExternalOrganisationsInput['prescribingOrganizationId'],
  current: Pick<
    Beneficiary,
    'involvedPartners' | 'serviceProviders' | 'prescribingStructure'
  > & { contributingPartners: unknown[] }
) {
  const legacyNulls: Partial<
    Record<
      'prescribingStructure' | 'involvedPartners' | 'serviceProviders',
      null
    >
  > = {}

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

  return legacyNulls
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
