import { deleteArchivedNames } from '~~/server/services/notification/delete-archive-names.service'
import { withErrorCapture } from '../utils'

/** Archived beneficiaries are anonymized after 1 year */
export default async function handler() {
  return await withErrorCapture(deleteArchivedNames)
}
