import { protectedProcedure, router } from '~/server/trpc'
import {
  editCurrentUserStructureMutation,
  getCurrentUserStructureQuery
} from '~/server/request/structure'

export const structureRouter = router({
  getCurrentUserStructure: protectedProcedure
    .input(getCurrentUserStructureQuery.inputValidation)
    .query(getCurrentUserStructureQuery.execute),
  editCurrentUserStructure: protectedProcedure
    .input(editCurrentUserStructureMutation.inputValidation)
    .mutation(editCurrentUserStructureMutation.execute)
})
