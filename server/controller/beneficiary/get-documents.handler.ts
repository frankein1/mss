import {
  ProtectedAppContext,
  invalidError,
  forbiddenError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  canListDocuments,
  canListConfidentialDocuments,
  canOnlyListItsUploadedDocuments
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'

export const getBeneficiaryDocumentsHandler = async ({
  ctx: { user },
  input: { beneficiaryId }
}: {
  input: { beneficiaryId: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  if (!canListDocuments(user, beneficiary)) {
    throw forbiddenError()
  }

  return await prismaClient.document.findMany({
    where: {
      beneficiaryId,
      confidential: canListConfidentialDocuments(user, beneficiary)
        ? undefined
        : false,
      createdById: canOnlyListItsUploadedDocuments(user, beneficiary)
        ? user.id
        : undefined
    }
  })
}
