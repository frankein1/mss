import { createQuery } from '~/server/route'
import { getFileInstructionTypeStatsQuery } from '~/server/query/stats'
import type { ProtectedAppContext } from '~/server/trpc'
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
  return await getFileInstructionTypeStatsQuery(user, input)
}

export const getFileInstructionTypeStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
