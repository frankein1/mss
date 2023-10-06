import { createQuery } from '~/server/request'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getFollowupFollowupTypesStatsQuery } from '~/server/query/stats'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupFollowupTypesStatsQuery(user, input)
}

export const getFollowupFollowupTypesStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
