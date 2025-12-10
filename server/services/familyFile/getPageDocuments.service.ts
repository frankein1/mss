import type { Prisma } from '@prisma/client'
import { getFamilyFileSecurityTarget } from './permission.service'
import { DocumentRepo } from '~/server/database'
import type {
  BeneficiaryDocumentFilterInput,
  GetDocumentsInput
} from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getDocumentPermissions } from '~/server/security'
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

  if (filters.beneficiaryId) {
    formattedFilters.beneficiaryId = filters.beneficiaryId
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
      select: {
        key: true,
        name: true,
        type: true,
        size: true,
        tags: true,
        confidential: true,
        createdById: true,
        beneficiaryId: true,
        created: true,
        migrated: true,
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
