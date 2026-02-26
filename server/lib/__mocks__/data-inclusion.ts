import { dataInclusionStructures } from './mocked-structures'

export async function fetchStructuresPages() {
  return {
    items: dataInclusionStructures,
    total: dataInclusionStructures.length,
    page: 1,
    size: dataInclusionStructures.length,
    pages: 1
  }
}
