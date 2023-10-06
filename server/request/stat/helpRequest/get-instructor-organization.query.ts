import { createQuery } from '~/server/request'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getHelpRequestInstructorOrganizationStatsQuery } from '~/server/query/stats'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestInstructorOrganizationStatsQuery(user, input)
}

export const getInstructorOrganizationStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
