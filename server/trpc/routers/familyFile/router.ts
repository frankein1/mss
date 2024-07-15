import { familyFileRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const fileRouter = router({
  getSocialSupports: protectedProcedure
    .input(routes.getSocialSupports.inputValidation)
    .query(routes.getSocialSupports.execute),
  getDocuments: protectedProcedure
    .input(routes.getDocumentsQuery.inputValidation)
    .query(routes.getDocumentsQuery.execute),
  getExaminationDates: protectedProcedure
    .input(routes.getExaminationDatesQuery.inputValidation)
    .query(routes.getExaminationDatesQuery.execute),
  getBeneficiaryId: protectedProcedure
    .input(routes.getBeneficiaryId.inputValidation)
    .query(routes.getBeneficiaryId.execute)
})
