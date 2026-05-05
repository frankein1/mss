import { getFamilyFileMinimalInfoQuery } from './get-minimal-info.query'
import { getSocialSupports } from './get-social-supports.query'
import { getDocumentsQuery } from './get-documents.query'
import { getExaminationDatesQuery } from './getExaminationDates.query'
import { split } from './split.mutation'
import { getDeviceNamesForFamilyFileQuery } from './get-device-names.query'

export const familyFileRoutes = {
  getFamilyFileMinimalInfoQuery,
  getSocialSupports,
  getDocumentsQuery,
  getExaminationDatesQuery,
  split,
  getDeviceNamesForFamilyFileQuery
}
