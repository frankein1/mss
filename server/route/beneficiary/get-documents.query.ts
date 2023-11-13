import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canListDocuments,
  getDocumentPermissions
} from '~/server/security'
import { getBeneficiarySecurityTarget } from '~/server/query'
import {
  GetDocumentsInput,
  BeneficiaryDocumentFilterInput,
  getDocumentsSchema
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { DocumentRepo } from '~/server/database'

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
  const beneficiary = await getBeneficiarySecurityTarget(
    grantee,
    input.beneficiaryId
  )

  return canListDocuments(grantee, beneficiary)
}

const handler = async ({
  ctx,
  input: { beneficiaryId, filters, orderBy, perPage, page }
}: {
  input: GetDocumentsInput
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx

  const { take, skip } =
    page && perPage
      ? takeAndSkipFromPagination({
          perPage,
          page
        })
      : { take: undefined, skip: undefined }

  const where: Prisma.DocumentWhereInput = {
    beneficiaryId,
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
            Notification: {
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

  const beneficiary = await getBeneficiarySecurityTarget(user, beneficiaryId)

  const documentsWithPermissions = documents.map(document => ({
    document,
    permissions: getDocumentPermissions({
      user,
      structure,
      beneficiary,
      document
    })
  }))

  return {
    documents: documentsWithPermissions,
    count,
    totalPages
  }
}

export const getBeneficiaryDocumentsQuery = createQuery({
  inputValidation: getDocumentsSchema,
  securityCheck,
  handler
})
