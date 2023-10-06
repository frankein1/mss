import { createQuery } from '~/server/route'
import { getFollowupStatusStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupStatusStatsQuery(user, input)
}

export const getFollowupStatusStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
