import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const getBeneficiaryDraftHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.beneficiaryDraft.findUnique({
    where: {
      id,
      createdById: user.id,
      structureId: user.structureId
    }
  })

  if (!beneficiaryDraft) {
    throw notfoundError()
  }

  return beneficiaryDraft
}
