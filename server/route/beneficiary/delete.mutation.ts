import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import {
  SecurityRuleGrantee,
  canDeleteBeneficiary
} from '~/server/security/rules'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { IdInput, idSchema } from '~/server/schema'
import { createMutation } from '~/server/route/createRoute'
import { BeneficiaryRelativeRepo, BeneficiaryRepo } from '~/server/database'

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canDeleteBeneficiary(grantee, beneficiary)
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(user, id)

  await updateBeneficiaryRelatives(user, id)

  await BeneficiaryRepo.prisma.delete({ where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })
}

async function updateBeneficiaryRelatives(
  user: SecurityRuleGrantee,
  linkedBeneficiaryId: string
) {
  const relatives = await BeneficiaryRelativeRepo.findMany(user, {
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
    await BeneficiaryRelativeRepo.prisma.update({
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
  inputValidation: idSchema,
  securityCheck,
  handler
})
