import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewFollowup } from '~/server/security/rules'
import { getFollowupWithBeneficiaryDocumentsAndTypesAndPrescribingOrganization } from '~/server/query/followups'
import { getFollowupAccessibleData } from '~/utils/followup'

export const getFollowupDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const followup =
    await getFollowupWithBeneficiaryDocumentsAndTypesAndPrescribingOrganization(
      id
    )

  if (!followup || !canViewFollowup(user, followup.beneficiary)) {
    throw forbiddenError()
  }

  const data = getFollowupAccessibleData(user, followup)

  return data
}
