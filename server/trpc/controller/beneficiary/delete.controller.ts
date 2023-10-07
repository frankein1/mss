import { UserActivityType } from '@prisma/client'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { canDeleteBeneficiary } from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const deleteBeneficiaryHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  if (!beneficiary) {
    throw invalidError('Beneficiary not found')
  }

  if (!canDeleteBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

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
