import { UserActivityType } from '@prisma/client'
import { createMutation } from '../../request/createRequest'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/security'
import {
  SecurityRuleGrantee,
  canDeleteBeneficiary
} from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { IdInput, idSchema } from '~/server/schema'

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.id)

  return canDeleteBeneficiary(grantee, beneficiary)
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  await updateBeneficiaryRelatives(id)

  await prismaClient.beneficiary.delete({ where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })
}

async function updateBeneficiaryRelatives(linkedBeneficiaryId: string) {
  const relatives = await prismaClient.beneficiaryRelative.findMany({
    where: {
      linkedBeneficiaryId
    },
    include: {
      linkedBeneficiary: true
    }
  })

  if (!relatives?.length) {
    return
  }

  for (const relative of relatives) {
    const { linkedBeneficiary: lb } = relative
    await prismaClient.beneficiaryRelative.update({
      data: {
        linkedBeneficiaryId: null,
        email: lb?.email || null,
        firstName: lb?.firstName || null,
        lastName: lb?.usualName || null,
        city: lb?.city || null,
        phone: lb?.phone1 || lb?.phone2 || null
      },
      where: {
        id: relative.id
      }
    })
  }
}

export const deleteBeneficiaryMutation = createMutation({
  path: 'delete',
  inputValidation: idSchema,
  securityCheck,
  handler
})
