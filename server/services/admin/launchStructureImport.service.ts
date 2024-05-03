import { DataInclusionHandler } from '~/server/integrations/data-inclusion/structure-import.service'

export function launchDataInclusionStructureImport() {
  return DataInclusionHandler.handleStructuresImport(false)
}
