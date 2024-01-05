import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  canListDocuments,
  getDocumentPermissions
} from '~/server/security'
import {
  GetDocumentsInput,
  BeneficiaryDocumentFilterInput,
  getDocumentsSchema
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { DocumentRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

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
  ctx: SecurityRuleContext,
  input: GetDocumentsInput
) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.beneficiaryId
  )

  return canListDocuments(ctx.user, beneficiary)
}

const handler = async ({
  ctx,
  input: { beneficiaryId, filters, orderBy, perPage, page }
}: {
  input: GetDocumentsInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx

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

  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    beneficiaryId
  )

  const documentsWithPermissions = documents.map(document => ({
    document,
    permissions: getDocumentPermissions({
      ctx,
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
