import { getJobResultsForDataInclusion } from './getJobResults.service'
import { launchDataInclusionStructureImport } from './launchStructureImport.service'
import { disableStructure } from './disable-structure.service'
import { sendDisableStructureCode } from './send-disable-structure-code.service'

export const AdminService = {
  getJobResultsForDataInclusion,
  launchDataInclusionStructureImport,
  disableStructure,
  sendDisableStructureCode
}
