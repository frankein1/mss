import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { getHelpRequestInstructionsStats } from '~~/server/query/stats/helpRequest/getHelpRequestInstructionsStats'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestInstructionsStats(user, input)
}

export const getHelpRequestInstructionsStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
