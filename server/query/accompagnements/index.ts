import { getBeneficiary } from './getBeneficiary'
import { getFollowup } from './getFollowup'
import { getHelpRequest } from './getHelpRequest'
import { iterateHelpRequests } from './iterateHelpRequests'

export const AccompagnementsQuery = {
  getBeneficiary,
  getFollowup,
  getHelpRequest,
  iterateHelpRequests
}

export {
  type HelpRequestsListResult,
  type HelpRequestsList,
  type HelpRequestsListItem
} from './iterateHelpRequests'
