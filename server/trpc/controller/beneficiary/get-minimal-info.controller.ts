import {
  ProtectedAppContext,
  forbiddenError,
  notfoundError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewBeneficiary } from '~/server/security/rules'

export const getBeneficiaryMinimalInfoHandler = async ({
  input: { id },
  ctx: { user, structure }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { id, structureId: structure.id },
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

  const {
    referents: _,
    structureId: __,
    ...beneficiaryMinimalInfo
  } = beneficiary

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  return beneficiaryMinimalInfo
}
