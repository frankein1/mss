import { getStatisticsSharingsForStructureQuery } from './get-for-structure.query'
import { inviteDecisionMakerMutation } from './invite-decision-maker.mutation'
import { revokeStatisticsSharingMutation } from './revoke.mutation'

export const statisticsSharingRoutes = {
  getStatisticsSharingsForStructureQuery,
  inviteDecisionMakerMutation,
  revokeStatisticsSharingMutation
}
