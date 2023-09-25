import type { Prisma } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import type {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareGetHelpRequestsPageSelect } from '~/utils/helpRequest'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { SortOrder } from '~/types/table'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

export const getHelpRequestsHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.HelpRequestWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareHelpRequestFilters(
      input.filters,
      canOnlyListItsBeneficiaries(user)
    )
  }

  const orderBy: GetHelpRequestsOrderBy = input.orderBy

  if (orderBy.find(s => !!s.instructorOrganization)) {
    orderBy.unshift({ externalStructure: SortOrder.Desc })
  }

  const select = prepareGetHelpRequestsPageSelect(user)

  const [helpRequests, count] = await Promise.all([
    prismaClient.helpRequest.findMany({
      where,
      select,
      take,
      skip,
      orderBy: input.orderBy
    }),
    prismaClient.helpRequest.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { helpRequests, count, totalPages }
}
