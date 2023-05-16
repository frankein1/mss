import { getBeneficiary } from './getBeneficiary'
import { getFollowup } from './getFollowup'
import { getHelpRequest } from './getHelpRequest'
import { iterateHelpRequests } from './iterateHelpRequests'
import { addFollowup } from './addFollowup'

export const AccompagnementsQuery = {
  getBeneficiary,
  getFollowup,
  getHelpRequest,
  iterateHelpRequests,
  addFollowup
}

export {
  type HelpRequestsListResult,
  type HelpRequestsList,
  type HelpRequestsListItem
} from './iterateHelpRequests'
