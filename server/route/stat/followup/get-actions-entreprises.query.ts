import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { getFollowupActionsEntreprisesStatsQuery } from '~~/server/query/stats'
import { AllowSecurityCheck } from '~~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupActionsEntreprisesStatsQuery(ctx, input)
}

export const getFollowupActionsEntreprisesStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
