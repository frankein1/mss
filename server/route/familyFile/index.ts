import { getFamilyFileMinimalInfoQuery } from './get-minimal-info.query'
import { getSocialSupports } from './get-social-supports.query'
import { getSocialSupportsSummary } from './get-social-supports-summary.query'
import { getDocumentsQuery } from './get-documents.query'
import { getExaminationDatesQuery } from './getExaminationDates.query'
import { getBeneficiaryId } from './getBeneficiaryId.query'
import { split } from './split.mutation'

export const familyFileRoutes = {
  getFamilyFileMinimalInfoQuery,
  getSocialSupports,
  getSocialSupportsSummary,
  getDocumentsQuery,
  getExaminationDatesQuery,
  getBeneficiaryId,
  split
}
