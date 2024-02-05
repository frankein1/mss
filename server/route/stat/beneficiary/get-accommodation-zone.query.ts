import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getAccommodationZoneStatsQuery } from '~/server/query/stats'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getAccommodationZoneStatsQuery(user, input)
}

export const getAccommodationZoneStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
