import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { getFollowupRedirectionsStatsQuery } from '~/server/query/stats'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupRedirectionsStatsQuery(user, input)
}

export const getRedirectionsStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
