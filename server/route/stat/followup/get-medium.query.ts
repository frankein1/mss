import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { getFollowupMediumStatsQuery } from '~~/server/query/stats'
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
  return await getFollowupMediumStatsQuery(user, input)
}

export const getFollowupMediumStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
