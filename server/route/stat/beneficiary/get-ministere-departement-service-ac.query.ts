import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { getMinistereDepartementServiceAcStatsQuery } from '~~/server/query/stats'
import { AllowSecurityCheck } from '~~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereDepartementServiceAcStatsQuery(user, input)
}

export const getMinistereDepartementServiceAcStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
