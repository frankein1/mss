import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import { WorkshopAttendeeListType } from '@prisma/client'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopCities(input, ctx)
}

export const getWorkshopCities = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)
  const attendees = await WorkshopAttendeeRepo.findMany(ctx.user, {
    select: {
      beneficiary: {
        select: {
          city: true
        }
      },
      workshopExternalAttendee: {
        select: {
          city: true
        }
      }
    },
    where: {
      listType: WorkshopAttendeeListType.Main,
      workshop: { structureId: ctx.structure.id, ...workshopFilters }
    }
  })

  return Object.values(
    attendees.reduce<Record<string, { city: string | null; _count: number }>>(
      (acc, { beneficiary, workshopExternalAttendee }) => {
        const city = (beneficiary || workshopExternalAttendee)?.city ?? null
        const key = city ?? 'null'
        acc[key] = { city, _count: (acc[key]?._count ?? 0) + 1 }
        return acc
      },
      {}
    )
  ).sort((a, b) => b._count - a._count)
}

export const getWorkshopAttendeeCityStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
