import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { getHelpRequestBeneficiaryNumberQuery } from '~/server/query/stats'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestBeneficiaryNumberQuery(user, input)
}

export const getHelpRequestBeneficiaryNumberQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
