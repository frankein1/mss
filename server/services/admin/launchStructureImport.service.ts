import { DataInclusionIntegrationHandler } from '~/server/integrations/data-inclusion/structure-import.service'

export function launchDataInclusionStructureImport() {
  return DataInclusionIntegrationHandler.handleStructuresImport(false)
}
