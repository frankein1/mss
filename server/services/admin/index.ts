import { getJobResultsForDataInclusion } from './getJobResults.service'
import { launchDataInclusionStructureImport } from './launchStructureImport.service'
import { launchBrevoExport } from './launchBrevoExport.service'
import { disableStructure } from './disable-structure.service'

export const AdminService = {
  getJobResultsForDataInclusion,
  launchDataInclusionStructureImport,
  launchBrevoExport,
  disableStructure
}
