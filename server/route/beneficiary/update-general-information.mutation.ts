import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryGeneralInformationInput,
  updateBeneficiaryGeneralInformationSchema
} from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.general
}

function cleanInput(input: UpdateBeneficiaryGeneralInformationInput) {
  if (!input.vulnerablePerson) {
    input.vulnerablePersonType = null
  }

  if (input.noPhone) {
    input.phone1 = null
    input.phone2 = null
  }

  return input
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

  const { referents: previousReferents } = target
  const previousReferentIds = previousReferents.map(({ id }) => id)
  const referentConnections = prepareRelationConnections(
    referents,
    previousReferentIds
  )

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: {
      ...cleaned,
      referents: referentConnections
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
