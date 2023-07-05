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

  await updateBeneficiaryRelatives(beneficiary.id)

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

  if (relatives?.length) {
    return
  }

  relatives.forEach(relative => {
    const { linkedBeneficiary } = relative
    relative.linkedBeneficiaryId = null
    relative.email = linkedBeneficiary?.email || null
    relative.firstName = linkedBeneficiary?.firstName || null
    relative.lastName = linkedBeneficiary?.usualName || null
    relative.city = linkedBeneficiary?.city || null
    relative.phone =
      linkedBeneficiary?.phone1 || linkedBeneficiary?.phone2 || null
  })

  await prismaClient.beneficiaryRelative.updateMany({ data: relatives })
}
