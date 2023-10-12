import { getHelpRequestAccessibleData } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewHelpRequest
} from '~/server/security/rules'
import {
  getHelpRequestWithRelations,
  getHelpRequestsecurityTarget
} from '~/server/query/helpRequests'
import { IdInput, idSchema } from '~/server/schema'

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequestWithRelations(user, id)

  const data = getHelpRequestAccessibleData(user, helpRequest)

  return data
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const helpRequest = await getHelpRequestsecurityTarget(user, input.id)
  return canViewHelpRequest(user, helpRequest.beneficiary)
}

export const getHelpRequestDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
