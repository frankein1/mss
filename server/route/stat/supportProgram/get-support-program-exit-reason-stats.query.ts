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
  return getSupportProgramExitReasons(input, ctx)
}

/**
 * Support programs per exit reason, only for support programs with lifecycle.
 * Support programs without exit reason are grouped under a `null` id.
 */
export const getSupportProgramExitReasons = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: { exitReason: { select: { id: true, name: true } } },
    where: {
      ...prepareSupportProgramStatFilters(input),
      supportProgramName: { hasLifecycle: true }
    }
  })

  const exitReasons = new Map<
    string | null,
    { id: string | null; name: string | null; _count: number }
  >()

  for (const { exitReason } of supportPrograms) {
    const id = exitReason?.id ?? null
    const item = exitReasons.get(id) ?? {
      id,
      name: exitReason?.name ?? null,
      _count: 0
    }
    item._count++
    exitReasons.set(id, item)
  }

  return [...exitReasons.values()].sort((a, b) => {
    // Not filled always comes last
    if (a.id === null || b.id === null) {
      return Number(a.id === null) - Number(b.id === null)
    }
    return (
      b._count - a._count || (a.name ?? '').localeCompare(b.name ?? '', 'fr')
    )
  })
}

export const getSupportProgramExitReasonStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
