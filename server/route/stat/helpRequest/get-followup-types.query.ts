import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getHelpRequestFollowupTypesStatsQuery } from '~/server/query/stats'
import { AllowSecurityCheck } from '~/server/security'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestFollowupTypesStatsQuery(user, input)
}

export const getHelpRequestFollowupTypesStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
