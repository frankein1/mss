import dayjs from 'dayjs'
import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SupportProgramStatFilterInput } from '~~/server/schema'
import { supportProgramStatFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramRepo } from '~~/server/database'
import {
  prepareDateFilters,
  prepareSupportProgramStatFilters
} from '~~/server/query/stats/helpers'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SupportProgramStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getSupportProgramEntriesExits(input, ctx)
}

/**
 * Entries, exits and ongoing support programs per support program name.
 * An exit is an end date reached on the reference date: today, or the end of
 * the filtered period when it is earlier. Otherwise (no end date, or an end
 * date after the reference date) the support program is ongoing.
 * Each enrollment is counted: a beneficiary entering a support program twice counts twice.
 */
export const getSupportProgramEntriesExits = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: {
      startDate: true,
      endDate: true,
      supportProgramName: { select: { id: true, name: true } }
    },
    where: {
      AND: [
        prepareSupportProgramStatFilters(input),
        { OR: [{ startDate: { not: null } }, { endDate: { not: null } }] }
      ]
    }
  })

  const endOfToday = dayjs().endOf('day').toDate()
  const periodEnd = prepareDateFilters(input)?.lte
  const referenceDate =
    periodEnd && periodEnd < endOfToday ? periodEnd : endOfToday

  const names = new Map<
    string,
    {
      id: string
      name: string
      entries: number
      exits: number
      ongoing: number
    }
  >()

  for (const { startDate, endDate, supportProgramName } of supportPrograms) {
    const item = names.get(supportProgramName.id) ?? {
      ...supportProgramName,
      entries: 0,
      exits: 0,
      ongoing: 0
    }
    if (startDate) {
      item.entries++
    }
    if (endDate && endDate <= referenceDate) {
      item.exits++
    } else {
      item.ongoing++
    }
    names.set(supportProgramName.id, item)
  }

  return [...names.values()].sort(
    (a, b) =>
      b.entries - a.entries ||
      b.exits - a.exits ||
      a.name.localeCompare(b.name, 'fr')
  )
}

export const getSupportProgramEntriesExitsStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
