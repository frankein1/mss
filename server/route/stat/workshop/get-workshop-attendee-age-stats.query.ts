import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import { WorkshopAttendeeListType } from '@prisma/client'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import type { AgeGroup } from '~/client/options'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import getAgeGroup from '~/utils/getAgeGroup'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopAttendeeAge(input, ctx)
}

export const getWorkshopAttendeeAge = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)

  const attendees = await WorkshopAttendeeRepo.findMany(ctx.user, {
    select: {
      beneficiary: {
        select: {
          birthDate: true
        }
      },
      workshopExternalAttendee: {
        select: {
          birthDate: true
        }
      }
    },
    where: {
      listType: WorkshopAttendeeListType.Main,
      workshop: { structureId: ctx.structure.id, ...workshopFilters }
    }
  })
  return Object.values(
    attendees.reduce<
      Record<string, { ageGroup: AgeGroup | null; _count: number }>
    >((acc, { beneficiary, workshopExternalAttendee }) => {
      const birthdate = (beneficiary || workshopExternalAttendee)?.birthDate
      const ageGroup = birthdate ? getAgeGroup(birthdate) : null
      const key = ageGroup ?? STATS_NULL_KEY

      acc[key] = { ageGroup, _count: (acc[key]?._count ?? 0) + 1 }
      return acc
    }, {})
  ).sort((a, b) => b._count - a._count)
}

export const getWorkshopAttendeeAgeStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
