import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const getBeneficiaryMinimalInfoHandler = ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  return prismaClient.beneficiary.findFirst({
    where: { id, structureId: user.structureId },
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true
    }
  })
}
