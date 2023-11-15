import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryReferents,
  getBeneficiaryPermissions,
  BeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import {
  UpdateBeneficiaryGeneralInformationInput,
  updateBeneficiaryGeneralInformationSchema
} from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const target = await getBeneficiarySecurityTarget(user, input.id)
  const structure = await getStructureByUser(user)
  const permissions = getBeneficiaryPermissions({
    user,
    structure,
    target
  })
  return permissions.edit.general
}

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  ctx: ProtectedAppContext
}) => {
  const { id, referents } = input
  const target = await getBeneficiarySecurityTarget(user, input.id)

  const permissions = getBeneficiaryPermissions({ user, structure, target })
  const data = filterInput({ input, permissions })

  if (!data.noPhone) {
    data.phone1 = null
    data.phone2 = null
  }

  let referentConnections
  if (canEditBeneficiaryReferents(user, target)) {
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
