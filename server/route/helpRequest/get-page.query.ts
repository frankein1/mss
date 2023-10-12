import type { Prisma } from '@prisma/client'
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy,
  getHelpRequestsSchema
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { SortOrder } from '~/types/table'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { HelpRequestRepo } from '~/server/repository'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

const handler = async ({
  input,
  ctx: { user, structure }
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
    structureId: structure.id,
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
    HelpRequestRepo.findMany(user, {
      where,
      select,
      take,
      skip,
      orderBy: input.orderBy
    }),
    HelpRequestRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { helpRequests, count, totalPages }
}

export const getHelpRequestsQuery = createQuery({
  inputValidation: getHelpRequestsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
