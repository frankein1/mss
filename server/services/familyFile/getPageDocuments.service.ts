import { Prisma } from '@prisma/client'
import { getFamilyFileSecurityTarget } from './permission.service'
import { DocumentRepo } from '~/server/database'
import {
  BeneficiaryDocumentFilterInput,
  GetDocumentsInput
} from '~/server/schema'
import { SecurityRuleContext, getDocumentPermissions } from '~/server/security'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

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

export async function getPageDocuments({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetDocumentsInput
}) {
  const { user } = ctx
  const { page, perPage, familyFileId, filters, orderBy } = input

  const { take, skip } =
    page && perPage
      ? takeAndSkipFromPagination({
          perPage,
          page
        })
      : { take: undefined, skip: undefined }

  const where: Prisma.DocumentWhereInput = {
    familyFileId,
    ...prepareBeneficiaryDocumentsFilters(filters || {})
  }

  const [documents, count] = await Promise.all([
    DocumentRepo.findMany(user, {
      where,
      orderBy,
      take,
      skip,
      include: {
        _count: {
          select: {
            notifications: {
              where: { read: false, recipientId: user.id }
            }
          }
        }
      }
    }),
    DocumentRepo.count(user, {
      where
    })
  ])
  const totalPages = page && perPage ? getTotalPages({ count, perPage }) : 1

  const familyFile = await getFamilyFileSecurityTarget(user, familyFileId)

  const documentsWithPermissions = documents.map(document => ({
    document,
    permissions: getDocumentPermissions({
      ctx,
      familyFile,
      document
    })
  }))

  return {
    documents: documentsWithPermissions,
    count,
    totalPages
  }
}
