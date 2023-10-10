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
  UpdateBeneficiaryDraftInput,
  UpdateBeneficiaryEntourageInput,
  updateBeneficiaryEntourageSchema
} from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { BeneficiaryRepo } from '~/server/query'

function getBeneficiarySecurityTargetWithEntourage(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, structureId: true }
      },
      relatives: {
        where: { hosted: false }
      }
    }
  })
}

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryDraftInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryReferents(grantee, beneficiary)
  )
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryEntourageInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTargetWithEntourage(
    user,
    input.id
  )

  const { id, entourages } = input

  let data = {}

  const { relatives: previousRelatives } = beneficiary

  const newEntourages =
    entourages
      ?.filter(e =>
        // Does not save empty relative
        Object.entries(e).some(([key, value]) => key !== 'id' && !!value)
      )
      .map(e => {
        return {
          hosted: false,
          ...e
        }
      }) || []

  const entouragesRelationUpdates = prepareRelationUpdates(
    newEntourages,
    previousRelatives
  )

  data = {
    ...data,
    relatives: entouragesRelationUpdates
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

export const updateEntourageMutation = createMutation({
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck,
  handler
})
