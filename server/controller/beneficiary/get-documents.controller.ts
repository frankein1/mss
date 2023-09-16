import { Prisma } from '@prisma/client'
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
import {
  GetDocumentsInput,
  BeneficiaryDocumentFilterInput
} from '~/server/schema'

function getPermissionConditions(user: ProtectedAppContextUser) {
  if (canOnlyListItsUploadedDocuments(user)) {
    return { createdById: user.id }
  }

  return {
    OR: [{ confidential: false }, { confidential: true, createdById: user.id }]
  }
}

function prepareBeneficiaryDocumentsFilters(
  filters: BeneficiaryDocumentFilterInput
) {
  const formattedFilters: Prisma.DocumentWhereInput = {}

  if (filters.tags) {
    formattedFilters.tags = { hasSome: filters.tags }
  }

  if (filters.type) {
    formattedFilters.type = filters.type
  }

  return formattedFilters
}

export const getBeneficiaryDocumentsTotalHandler = async ({
  ctx: { user },
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(id)

  if (!beneficiary) {
    throw invalidError()
  }

  if (!canListDocuments(user, beneficiary)) {
    throw forbiddenError()
  }

  const permissionConditions = getPermissionConditions(user)

  return await prismaClient.document.findMany({
    where: {
      beneficiaryId: id,
      ...permissionConditions
    },
    include: {
      _count: true
    }
  })
}

export const getBeneficiaryDocumentsHandler = async ({
  ctx: { user },
  input: { beneficiaryId, filters, orderBy }
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

  return await prismaClient.document.findMany({
    where: {
      beneficiaryId,
      ...permissionConditions,
      ...prepareBeneficiaryDocumentsFilters(filters)
    },
    orderBy,
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
