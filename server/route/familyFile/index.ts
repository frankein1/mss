import { getSocialSupports } from './get-social-supports.query'
import { getDocumentsQuery } from './get-documents.query'
import { getExaminationDatesQuery } from './getExaminationDates.query'
import { getBeneficiaryId } from './getBeneficiaryId.query'

export const familyFileRoutes = {
  getSocialSupports,
  getDocumentsQuery,
  getExaminationDatesQuery,
  getBeneficiaryId
}
