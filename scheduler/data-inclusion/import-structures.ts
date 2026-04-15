import { handleStructuresImport } from '~/server/integrations/data-inclusion/structure-import.service'
import { withErrorCapture } from '../utils'

export default async function handler() {
  return await withErrorCapture(() => handleStructuresImport())
}
