import { createQuery } from '~/server/request'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewHelpRequest
} from '~/server/security/rules'
import { getHelpRequestAccessibleData } from '~/utils/helpRequest'
import { getHelpRequestWithRelations } from '~/server/query/helpRequests'
import { IdInput, idSchema } from '~/server/schema'
import { getHelpRequestsecurityTarget } from '~/server/query/helpRequests/getHelpRequestSecurityTarget'

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequestWithRelations(id)

  const data = getHelpRequestAccessibleData(user, helpRequest)

  return data
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const helpRequest = await getHelpRequestsecurityTarget(input.id)
  return canViewHelpRequest(user, helpRequest.beneficiary)
}

export const getHelpRequestDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
