import type { Prisma } from '@prisma/client'
import type { GetFollowupsInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareFollowupFilters } from '~/utils/filters'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { prepareGetFollowupsPageSelect } from '~/utils/followup'

export const getFollowupsHandler = async ({
  input,
  ctx
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { user, structureId } = ctx
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.FollowupWhereInput = {
    structureId,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareFollowupFilters(input.filters, canOnlyListItsBeneficiaries(user))
  }

  const select = prepareGetFollowupsPageSelect(user)

  const [followups, count] = await Promise.all([
    prismaClient.followup.findMany({
      where,
      select,
      take,
      skip,
      orderBy: input.orderBy
    }),
    prismaClient.followup.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { followups, count, totalPages }
}

export type GetFollowupsOutput = Prisma.PromiseReturnType<
  typeof getFollowupsHandler
>['followups']

export type FollowupItem = GetFollowupsOutput[0]
