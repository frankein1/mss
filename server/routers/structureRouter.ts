import {
  getCurrentUserStructureHandler,
  editCurrentUserStructureHandler
} from '~/server/controller/structure.controller'
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
