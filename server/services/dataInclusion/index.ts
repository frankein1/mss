import { searchStructures } from './searchStructures.service'
import { createStructure } from './create.service'
import { updateStructure } from './update.service'
import { countStructures } from './count.service'
import { getStructureStatusInDB } from './getStatus.service'

export const DataInclusionService = {
  searchStructures,
  create: createStructure,
  update: updateStructure,
  count: countStructures,
  getStatus: getStructureStatusInDB
}
