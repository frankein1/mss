import { handleStructuresImport } from '~/server/integrations/data-inclusion/structure-import.service'
import { withErrorCapture } from '../utils'

withErrorCapture(() => handleStructuresImport(true))
