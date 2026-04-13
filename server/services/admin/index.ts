import { getJobResultsForDataInclusion } from './getJobResults.service'
import { launchDataInclusionStructureImport } from './launchStructureImport.service'
import { disableStructure } from './disable-structure.service'

export const AdminService = {
  getJobResultsForDataInclusion,
  launchDataInclusionStructureImport,
  disableStructure
}
