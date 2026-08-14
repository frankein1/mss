import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { statFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { getHelpRequestBeneficiaryNumberQuery } from '~~/server/query/stats'

const securityCheck = AllowSecurityCheck

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
