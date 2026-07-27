import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'
import {
  prepareDateFilters,
  prepareWorkshopStatFilters
} from '~/server/query/stats/helpers'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopCountStats(input, ctx)
}

export const getWorkshopCountStats = async (
  input: WorkshopStatFilterInput,
  { user, structure }: ProtectedAppContext
) => {
  const { date, ...workshopFilters } = prepareWorkshopStatFilters(input)
  const dateFilters = prepareDateFilters(input)
  const now = new Date().getTime()

  const [future, past] = await Promise.all([
    WorkshopRepo.count(user, {
      where: {
        ...workshopFilters,
        date: {
          lte: dateFilters?.lte,
          gte: new Date(Math.max(now, dateFilters?.gte?.getTime() ?? 0))
        },
        structureId: structure.id
      }
    }),
    WorkshopRepo.count(user, {
      where: {
        ...workshopFilters,
        date: {
          lte: new Date(Math.min(now, dateFilters?.lte?.getTime() ?? Infinity)),
          gte: dateFilters?.gte
        },
        structureId: structure.id
      }
    })
  ])
  return {
    future,
    past,
    total: past + future
  }
}

export const getWorkshopCountStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
