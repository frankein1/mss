import type { Prisma } from '@prisma/client'
<<<<<<< Updated upstream:server/trpc/controller/followup/get-page.controller.ts
import type { GetFollowupsInput } from '~/server/schema'
=======
import { createQuery } from '../createRoute'
import { prepareGetFollowupsPageSelect } from './helper'
import { GetFollowupsInput, getFollowupsSchema } from '~/server/schema'
>>>>>>> Stashed changes:server/route/followup/get-page.query.ts
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareFollowupFilters } from '~/utils/filters'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
<<<<<<< Updated upstream:server/trpc/controller/followup/get-page.controller.ts
import { prepareGetFollowupsPageSelect } from '~/utils/followup'
=======
import { AllowSecurityCheck } from '~/server/security/rules/types'
>>>>>>> Stashed changes:server/route/followup/get-page.query.ts

export const getFollowupsHandler = async ({
  input,
  ctx
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.FollowupWhereInput = {
    structureId: structure.id,
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
