import { UserActivityType } from '@prisma/client'
import { createMutation } from '../../request/createRequest'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryReferents
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryDraftInput,
  UpdateBeneficiaryEntourageInput,
  updateBeneficiaryEntourageSchema
} from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import { getBeneficiarySecurityTarget } from '~/server/security'

function getBeneficiarySecurityTargetWithEntourage(id: string) {
  return prismaClient.beneficiary.findUniqueOrThrow({
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
  input: UpdateBeneficiaryEntourageInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTargetWithEntourage(input.id)

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

  const updatedBeneficiary = await prismaClient.beneficiary.update({
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
  path: 'updateEntourage',
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck,
  handler
})
