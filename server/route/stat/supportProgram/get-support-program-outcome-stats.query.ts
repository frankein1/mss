import { SupportProgramOutcome } from '@prisma/client'
import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SupportProgramStatFilterInput } from '~~/server/schema'
import { supportProgramStatFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramRepo } from '~~/server/database'
import { prepareSupportProgramStatFilters } from '~~/server/query/stats/helpers'

const securityCheck = AllowSecurityCheck

// Ties keep the outcome order, from worst to best
const outcomeOrder: (SupportProgramOutcome | null)[] = [
  ...Object.values(SupportProgramOutcome),
  null
]

const handler = async ({
  input,
  ctx
}: {
  input: SupportProgramStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getSupportProgramOutcome(input, ctx)
}

export const getSupportProgramOutcome = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: { outcome: true },
    where: {
      ...prepareSupportProgramStatFilters(input)
    }
  })

  return outcomeOrder
    .map(outcome => ({
      outcome,
      _count: supportPrograms.filter(sp => sp.outcome === outcome).length
    }))
    .filter(({ _count }) => _count > 0)
    .sort((a, b) => {
      // Not filled always comes last
      if (a.outcome === null || b.outcome === null) {
        return Number(a.outcome === null) - Number(b.outcome === null)
      }
      return b._count - a._count
    })
}

export const getSupportProgramOutcomeStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
