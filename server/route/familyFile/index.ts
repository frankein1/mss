import { getFamilyFileMinimalInfoQuery } from './get-minimal-info.query'
import { getSocialSupports } from './get-social-supports.query'
import { getDocumentsQuery } from './get-documents.query'
import { getExaminationDatesQuery } from './getExaminationDates.query'
import { split } from './split.mutation'
import { getDeviceNamesForFamilyFileQuery } from './get-device-names.query'

import { addReferentToFamilyFileMutation } from './add-referent.mutation'
import { deleteReferentFromFamilyFileMutation } from './delete-referent.mutation'

export const familyFileRoutes = {
  getFamilyFileMinimalInfoQuery,
  getSocialSupports,
  getDocumentsQuery,
  getExaminationDatesQuery,
  split,
  addReferentToFamilyFileMutation,
  deleteReferentFromFamilyFileMutation,
  getDeviceNamesForFamilyFileQuery
}
