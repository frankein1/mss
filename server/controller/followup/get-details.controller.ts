import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewFollowup } from '~/server/security/rules'
import { getFollowupWithRelations } from '~/server/query/followups'
import { getFollowupAccessibleData } from '~/utils/followup'

export const getFollowupDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const followup = await getFollowupWithRelations(id)

  if (!followup || !canViewFollowup(user, followup.beneficiary)) {
    throw forbiddenError()
  }

  const data = getFollowupAccessibleData(user, followup)

  return data
}
