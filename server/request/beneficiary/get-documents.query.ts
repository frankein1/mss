import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/request'
import { ProtectedAppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canListDocuments,
  canOnlyListItsUploadedDocuments
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import {
  GetDocumentsInput,
  BeneficiaryDocumentFilterInput,
  getDocumentsSchema
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

function getPermissionConditions(user: SecurityRuleGrantee) {
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
    formattedFilters.tags = { hasSome: [filters.tags] }
  }

  if (filters.type) {
    formattedFilters.type = filters.type
  }

  return formattedFilters
}

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: GetDocumentsInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  return canListDocuments(grantee, beneficiary)
}

const handler = async ({
  ctx: { user },
  input: { beneficiaryId, filters, orderBy, perPage, page }
}: {
  input: GetDocumentsInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } =
    page && perPage
      ? takeAndSkipFromPagination({
          perPage,
          page
        })
      : { take: undefined, skip: undefined }

  const permissionConditions = getPermissionConditions(user)

  const where: Prisma.DocumentWhereInput = {
    beneficiaryId,
    ...permissionConditions,
    ...prepareBeneficiaryDocumentsFilters(filters || {})
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
  const totalPages = page && perPage ? getTotalPages({ count, perPage }) : 1

  return {
    documents,
    count,
    totalPages,
    totalCount
  }
}

export type GetBeneficiaryDocumentsOutput = Prisma.PromiseReturnType<
  typeof handler
>
export type Documents = GetBeneficiaryDocumentsOutput['documents']
export type DocumentItem = Documents[0]

export const getBeneficiaryDocumentsQuery = createQuery({
  inputValidation: getDocumentsSchema,
  securityCheck,
  handler
})
