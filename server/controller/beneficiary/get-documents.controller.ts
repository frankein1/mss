import {
  ProtectedAppContext,
  ProtectedAppContextUser,
  invalidError,
  forbiddenError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  canListDocuments,
  canOnlyListItsUploadedDocuments
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { GetDocumentsInput } from '~/server/schema'

function getPermissionConditions(user: ProtectedAppContextUser) {
  if (canOnlyListItsUploadedDocuments(user)) {
    return { createdById: user.id }
  }

  return {
    OR: [{ confidential: false }, { confidential: true, createdById: user.id }]
  }
}

export const getBeneficiaryDocumentsHandler = async ({
  ctx: { user },
  input: { beneficiaryId, filters }
}: {
  input: GetDocumentsInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  if (!canListDocuments(user, beneficiary)) {
    throw forbiddenError()
  }

  const permissionConditions = getPermissionConditions(user)

  // TODO: prepareBeneficiaryDocumentFilters function
  return await prismaClient.document.findMany({
    where: {
      beneficiaryId,
      ...permissionConditions
    },
    include: {
      _count: {
        select: {
          Notification: {
            where: { read: false, recipientId: user.id }
          }
        }
      }
    }
  })
}
