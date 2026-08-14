import { handleSchoolsImport } from '~~/server/integrations/data-education/school-import.service'
import { withErrorCapture } from '../utils'

export default async function handler() {
  return await withErrorCapture(() => handleSchoolsImport())
}
