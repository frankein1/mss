import {
  getCurrentUserStructureHandler,
  editCurrentUserStructureHandler
} from '~/server/controller/structure'
import { protectedProcedure, router } from '~/server/trpc'
import { editCurrentUserStructureSchema } from '~/server/schema'

export const structureRouter = router({
  getCurrentUserStructure: protectedProcedure.query(
    getCurrentUserStructureHandler
  ),
  editCurrentUserStructure: protectedProcedure
    .input(editCurrentUserStructureSchema)
    .mutation(editCurrentUserStructureHandler)
})
