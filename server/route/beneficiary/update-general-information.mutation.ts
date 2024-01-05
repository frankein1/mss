import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getBeneficiaryPermissions,
  BeneficiaryPermissions,
  SecurityRuleContext
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryGeneralInformationInput,
  updateBeneficiaryGeneralInformationSchema
} from '~/server/schema'
import { prepareRelationConnections, prepareDateFields } from '~/utils/prisma'
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
  const permissions = getBeneficiaryPermissions({
    ctx,
    beneficiary
  })
  return permissions.edit.general
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

  const permissions = getBeneficiaryPermissions({ ctx, beneficiary: target })
  const filteredData = filterInput({ input, permissions })
  const data = prepareDateFields(filteredData, ['birthDate', 'deathDate'])

  if (data.noPhone) {
    data.phone1 = null
    data.phone2 = null
  }

  let referentConnections
  if (permissions.set.referents) {
    const { referents: previousReferents } = target
    const previousReferentIds = previousReferents.map(({ id }) => id)
    referentConnections = prepareRelationConnections(
      referents,
      previousReferentIds
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: {
      ...data,
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

function filterInput({
  input,
  permissions
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  permissions: BeneficiaryPermissions
}) {
  const { set } = permissions
  const { id: _id, referents: _referents, ...data } = input
  if (!set.numeroPegase) {
    delete data.numeroPegase
  }
  if (!set.accommodationZone) {
    delete data.accommodationZone
  }
  return data
}
