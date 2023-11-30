import { protectedProcedure, router } from '~/server/trpc'
import {
  editCurrentUserStructureMutation,
  getCurrentUserStructureQuery
} from '~/server/route/structure'
import { getStructureFollowupTypeQuery } from '~/server/route/structure/get-followup-type.query'

export const structureRouter = router({
  getCurrentUserStructure: protectedProcedure
    .input(getCurrentUserStructureQuery.inputValidation)
    .query(getCurrentUserStructureQuery.execute),
  editCurrentUserStructure: protectedProcedure
    .input(editCurrentUserStructureMutation.inputValidation)
    .mutation(editCurrentUserStructureMutation.execute),
  getFollowupType: protectedProcedure
    .input(getStructureFollowupTypeQuery.inputValidation)
    .query(getStructureFollowupTypeQuery.execute)
})
