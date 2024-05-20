import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { getFollowupBeneficiaryNumberQuery } from '~/server/query/stats'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupBeneficiaryNumberQuery(user, input)
}

export const getFollowupBeneficiaryNumberQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
