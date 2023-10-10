import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryTaxHouseholdInput,
  updateBeneficiaryTaxHouseholdSchema
} from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { BeneficiaryRepo } from '~/server/query'

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
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryReferents(grantee, beneficiary)
  )
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

  const updatedBeneficiary = await BeneficiaryRepo.update(user, {
    where: { id },
    data
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return updatedBeneficiary
}

export const updateTaxHouseholdMutation = createMutation({
  inputValidation: updateBeneficiaryTaxHouseholdSchema,
  securityCheck,
  handler
})
