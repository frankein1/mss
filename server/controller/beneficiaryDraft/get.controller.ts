import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewBeneficiaryDraft } from '~/server/security/rules'

export const getBeneficiaryDraftHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.beneficiaryDraft.findUnique({
    where: { id }
  })

  if (!beneficiaryDraft || !canViewBeneficiaryDraft(user, beneficiaryDraft)) {
    throw notfoundError()
  }

  return beneficiaryDraft
}
