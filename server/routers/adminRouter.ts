import { protectedProcedure, router } from '../trpc'
import {
  adminGetStructuresSchema,
  adminGetUsersSchema,
  idSchema
} from '~/server/schema'
import {
  getStructuresController,
  getStructureController,
  getUsersController,
  getOverviewController
} from '~/server/controller/admin'

export const adminRouter = router({
  getStructures: protectedProcedure
    .input(adminGetStructuresSchema)
    .query(getStructuresController),
  getStructure: protectedProcedure
    .input(idSchema)
    .query(getStructureController),
  getUsers: protectedProcedure
    .input(adminGetUsersSchema)
    .query(getUsersController),
  getOverview: protectedProcedure.query(getOverviewController)
})
