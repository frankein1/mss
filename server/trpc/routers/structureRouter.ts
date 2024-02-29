import { protectedProcedure, router } from '~/server/trpc'
import {
  editCurrentUserStructureMutation,
  getCurrentUserStructureQuery,
  getStructureSocialSupportSubjectQuery
} from '~/server/route/structure'

export const structureRouter = router({
  getCurrentUserStructure: protectedProcedure
    .input(getCurrentUserStructureQuery.inputValidation)
    .query(getCurrentUserStructureQuery.execute),
  editCurrentUserStructure: protectedProcedure
    .input(editCurrentUserStructureMutation.inputValidation)
    .mutation(editCurrentUserStructureMutation.execute),
  getSocialSupportSubject: protectedProcedure
    .input(getStructureSocialSupportSubjectQuery.inputValidation)
    .query(getStructureSocialSupportSubjectQuery.execute)
})
