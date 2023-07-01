import { protectedProcedure, router } from '../../trpc'
import {
  adminCreateStructureSchema,
  adminEditStructureSchema,
  adminGetStructuresSchema,
  adminGetUsersSchema,
  idSchema
} from '~/server/schema'
import {
  createStructureController,
  editStructureController,
  getStructuresController,
  getStructureController,
  getUsersController,
  getOverviewController
} from '~/server/controller/admin'

export const adminRouter = router({
  createStructure: protectedProcedure
    .input(adminCreateStructureSchema)
    .mutation(createStructureController),
  getStructures: protectedProcedure
    .input(adminGetStructuresSchema)
    .query(getStructuresController),
  getStructure: protectedProcedure
    .input(idSchema)
    .query(getStructureController),
  editStructure: protectedProcedure
    .input(adminEditStructureSchema)
    .mutation(editStructureController),
  getUsers: protectedProcedure
    .input(adminGetUsersSchema)
    .query(getUsersController),
  getOverview: protectedProcedure.query(getOverviewController)
})
