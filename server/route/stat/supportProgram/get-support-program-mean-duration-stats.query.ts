import dayjs from 'dayjs'
import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SupportProgramStatFilterInput } from '~~/server/schema'
import { supportProgramStatFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramRepo } from '~~/server/database'
import { prepareSupportProgramStatFilters } from '~~/server/query/stats/helpers'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SupportProgramStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getSupportProgramMeanDuration(input, ctx)
}

/**
 * Mean duration in days between start and end dates.
 * Only support programs with both dates are taken into account.
 */
export const getSupportProgramMeanDuration = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: { startDate: true, endDate: true },
    where: {
      AND: [
        prepareSupportProgramStatFilters(input),
        { startDate: { not: null } },
        { endDate: { not: null } }
      ]
    }
  })

  const durations = supportPrograms
    .map(({ startDate, endDate }) =>
      dayjs(endDate).diff(dayjs(startDate), 'day')
    )
    .filter(duration => duration >= 0)

  if (!durations.length) {
    return { meanDurationInDays: null, supportProgramCount: 0 }
  }

  const total = durations.reduce((sum, duration) => sum + duration, 0)
  return {
    meanDurationInDays: Math.round(total / durations.length),
    supportProgramCount: durations.length
  }
}

export const getSupportProgramMeanDurationStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
