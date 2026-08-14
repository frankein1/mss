import { prepareFollowupStatFilters } from '../helpers'
import { RedirectionRepo } from '~~/server/database'
import type { StatFilterInput } from '~~/server/schema'
import type { SecurityRuleGrantee } from '~~/server/security/rules/types'

export async function getFollowupRedirectionReasonsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareFollowupStatFilters(input)

  const redirections = await RedirectionRepo.findMany(user, {
    where: {
      socialSupport: preparedFilters,
      redirectionReasonId: { not: null }
    },
    select: {
      socialSupportId: true,
      redirectionReason: { select: { id: true, name: true } }
    }
  })

  const reasonCounts: Record<
    string,
    { id: string; name: string; _count: number }
  > = {}

  for (const { redirectionReason } of redirections) {
    if (!redirectionReason) {
      continue
    }
    const entry = (reasonCounts[redirectionReason.id] ??= {
      id: redirectionReason.id,
      name: redirectionReason.name,
      _count: 0
    })
    entry._count++
  }

  const reasons = Object.values(reasonCounts).sort(
    (a, b) => b._count - a._count
  )

  return {
    followupsWithReason: {
      _count: new Set(redirections.map(r => r.socialSupportId)).size
    },
    reasons
  }
}
