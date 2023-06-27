import {
  ProtectedAppContext,
  invalidError,
  forbiddenError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  canListDocuments,
  canOnlyListItsUploadedDocuments
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'

function getPermissionConditions(user: ProtectedAppContext['user']) {
  if (canOnlyListItsUploadedDocuments(user)) {
    return { createdById: user.id }
  }

  return {
    OR: [{ confidential: false }, { confidential: true, createdById: user.id }]
  }
}

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

  const permissionConditions = getPermissionConditions(user)

  return await prismaClient.document.findMany({
    where: {
      beneficiaryId,
      ...permissionConditions
    },
    include: {
      _count: {
        select: {
          Notification: {
            where: { read: false }
          }
        }
      }
    }
  })
}
