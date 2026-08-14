import { createQuery } from '~~/server/route'
import { getFollowupMinistreStatsQuery } from '~~/server/query/stats'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupMinistreStatsQuery(user, input)
}

export const getFollowupMinistreStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
