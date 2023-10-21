import type { Prisma } from '@prisma/client'
import { prepareGetFollowupsPageSelect } from './helper/prepareGetFollowupsPageSelect'
import { createQuery } from '~/server/route'
import { GetFollowupsInput, getFollowupsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareFollowupFilters } from '~/utils/filters'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupRepo } from '~/server/database'

const handler = async ({
  input,
  ctx
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where = prepareFollowupFilters(input.filters)

  const [followups, count] = await Promise.all([
    FollowupRepo.findMany(user, {
      where,
      select: prepareGetFollowupsPageSelect(user),
      take,
      skip,
      orderBy: input.orderBy
    }),
    FollowupRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { followups, count, totalPages }
}

export type GetFollowupsOutput = Prisma.PromiseReturnType<
  typeof handler
>['followups']

export type FollowupItem = GetFollowupsOutput[0]

export const getFollowupsQuery = createQuery({
  inputValidation: getFollowupsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
