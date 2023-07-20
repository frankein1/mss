import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewHelpRequest } from '~/server/security/rules'
import { getHelpRequestAccessibleData } from '~/utils/helpRequest'
import { getHelpRequestWithRelations } from '~/server/query/helpRequests'

export const getHelpRequestDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const helpRequest = await getHelpRequestWithRelations(id)

  if (!helpRequest || !canViewHelpRequest(user, helpRequest.beneficiary)) {
    throw forbiddenError()
  }

  const data = getHelpRequestAccessibleData(user, helpRequest)

  return data
}
