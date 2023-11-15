import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryTaxHouseholdInput,
  updateBeneficiaryTaxHouseholdSchema
} from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import { BeneficiaryRepo } from '~/server/database'

function getBeneficiaryWithTaxHousehold(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      relatives: {
        include: { linkedBeneficiary: true },
        where: { hosted: true }
      }
    }
  })
}

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) => {
  const target = await getBeneficiarySecurityTarget(grantee, input.id)
  const structure = await getStructureByUser(grantee)
  const permissions = getBeneficiaryPermissions({
    user: grantee,
    structure,
    target
  })
  return permissions.edit.relatives
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryTaxHouseholdInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiaryWithTaxHousehold(user, input.id)

  const { id, taxHouseholds, ...taxHouseholdDatas } = input

  let data = {}
  data = { ...data, ...taxHouseholdDatas }

  const { relatives: previousRelatives } = beneficiary

  const newTaxHouseholds =
    taxHouseholds
      ?.filter(t =>
        // Does not save empty relative
        Object.entries(t).some(([key, value]) => key !== 'id' && !!value)
      )
      .map(e => {
        const { linkedBeneficiary, ...data } = e
        return {
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
          ...data
        }
      }) || []

  const taxHouseholdRelationUpdates = prepareRelationUpdates(
    newTaxHouseholds,
    previousRelatives
  )

  data = {
    ...data,
    relatives: taxHouseholdRelationUpdates
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}

export const updateTaxHouseholdMutation = createMutation({
  inputValidation: updateBeneficiaryTaxHouseholdSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateTaxHousehold',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
