import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import { WorkshopAttendeeListType, type Gender } from '@prisma/client'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).stats.view

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopGender(input, ctx)
}

export const getWorkshopGender = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)

  const attendees = await WorkshopAttendeeRepo.findMany(ctx.user, {
    select: {
      beneficiary: {
        select: {
          gender: true
        }
      },
      workshopExternalAttendee: {
        select: {
          gender: true
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
      Record<string | 'null', { gender: Gender | null; _count: number }>
    >((acc, { beneficiary, workshopExternalAttendee }) => {
      const gender = (beneficiary || workshopExternalAttendee)?.gender ?? null
      const key = gender ?? STATS_NULL_KEY
      acc[key] = { gender, _count: (acc[key]?._count ?? 0) + 1 }
      return acc
    }, {})
  ).sort((a, b) => b._count - a._count)
}

export const getWorkshopAttendeeGenderStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
