import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleContext,
  AppContextPermissions,
  getAppContextPermissions
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
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
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

  const appPermissions = getAppContextPermissions(ctx)
  const filteredData = filterInput({ input, appPermissions })
  const data = prepareDateFields(filteredData, ['birthDate', 'deathDate'])

  if (data.noPhone) {
    data.phone1 = null
    data.phone2 = null
  }

  const { referents: previousReferents } = target
  const previousReferentIds = previousReferents.map(({ id }) => id)
  const referentConnections = prepareRelationConnections(
    referents,
    previousReferentIds
  )

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
  appPermissions
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  appPermissions: AppContextPermissions
}) {
  const { module } = appPermissions
  const { id: _id, referents: _referents, ...data } = input
  if (!module.ministere) {
    delete data.numeroPegase
    delete data.accommodationZone
  }
  return data
}
