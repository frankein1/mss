import { getBeneficiary } from './getBeneficiary'
import { getFollowup } from './getFollowup'
import { getHelpRequest } from './getHelpRequest'
import { iterateFollowups } from './iterateFollowups'
import { iterateHelpRequests } from './iterateHelpRequests'
import { addFollowup } from './addFollowup'

export const AccompagnementsQuery = {
  getBeneficiary,
  getFollowup,
  getHelpRequest,
  iterateFollowups,
  iterateHelpRequests,
  addFollowup
}

export {
  type FollowupsListResult,
  type FollowupsList,
  type FollowupsListItem
} from './iterateFollowups'

export {
  type HelpRequestsListResult,
  type HelpRequestsList,
  type HelpRequestsListItem
} from './iterateHelpRequests'
