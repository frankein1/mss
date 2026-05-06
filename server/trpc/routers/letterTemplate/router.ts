import { letterTemplateRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const letterTemplateRouter = router({
  list: protectedProcedure
    .input(routes.listLetterTemplatesQuery.inputValidation)
    .query(routes.listLetterTemplatesQuery.execute),
  delete: protectedProcedure
    .input(routes.deleteLetterTemplateMutation.inputValidation)
    .mutation(routes.deleteLetterTemplateMutation.execute),
  rename: protectedProcedure
    .input(routes.renameLetterTemplateMutation.inputValidation)
    .mutation(routes.renameLetterTemplateMutation.execute)
})
