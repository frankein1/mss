import { familyFileRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const fileRouter = router({
  getFamilyFileMinimalInfo: protectedProcedure
    .input(routes.getFamilyFileMinimalInfoQuery.inputValidation)
    .query(routes.getFamilyFileMinimalInfoQuery.execute),
  getSocialSupports: protectedProcedure
    .input(routes.getSocialSupports.inputValidation)
    .query(routes.getSocialSupports.execute),
  getDocuments: protectedProcedure
    .input(routes.getDocumentsQuery.inputValidation)
    .query(routes.getDocumentsQuery.execute),
  getExaminationDates: protectedProcedure
    .input(routes.getExaminationDatesQuery.inputValidation)
    .query(routes.getExaminationDatesQuery.execute),
  split: protectedProcedure
    .input(routes.split.inputValidation)
    .mutation(routes.split.execute)
})
