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
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

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

export const getBeneficiaryDocumentsHandler = async ({
  ctx: { user },
  input: { beneficiaryId, filters, orderBy, perPage, page }
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

  const { take, skip } = takeAndSkipFromPagination({
    perPage,
    page
  })

  const permissionConditions = getPermissionConditions(user)

  const where: Prisma.DocumentWhereInput = {
    beneficiaryId,
    ...permissionConditions,
    ...prepareBeneficiaryDocumentsFilters(filters)
  }

  const [documents, count, totalCount] = await Promise.all([
    prismaClient.document.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        _count: {
          select: {
            Notification: {
              where: { read: false, recipientId: user.id }
            }
          }
        }
      }
    }),
    prismaClient.document.count({
      where
    }),
    prismaClient.document.count({
      where: {
        beneficiaryId,
        ...permissionConditions
      }
    })
  ])
  const totalPages = getTotalPages({ count, perPage })

  return {
    documents,
    count,
    totalPages,
    totalCount
  }
}
