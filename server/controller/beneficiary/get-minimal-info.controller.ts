import {
  ProtectedAppContext,
  forbiddenError,
  notfoundError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewBeneficiary } from '~/server/security/rules'

export const getBeneficiaryMinimalInfoHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await prismaClient.beneficiary.findFirst({
    where: { id, structureId: user.structureId },
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      referents: true,
      structureId: true
    }
  })

  if (!beneficiary) {
    throw notfoundError()
  }

  const { referents, structureId, ...beneficiaryMinimalInfo } = beneficiary

  if (
    !canViewBeneficiary(user, {
      referents,
      structureId,
      ...beneficiaryMinimalInfo
    })
  ) {
    throw forbiddenError()
  }

  return beneficiaryMinimalInfo
}
