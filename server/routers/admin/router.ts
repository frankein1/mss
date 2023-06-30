import { protectedProcedure, router } from '../../trpc'
import { adminGetStructuresSchema, adminGetUsersSchema } from '~/server/schema'
import {
  getStructuresController,
  getUsersController,
  getOverviewController
} from '~/server/controller/admin'

export const adminRouter = router({
  getStructures: protectedProcedure
    .input(adminGetStructuresSchema)
    .query(getStructuresController),
  getUsers: protectedProcedure
    .input(adminGetUsersSchema)
    .query(getUsersController),
  getOverview: protectedProcedure.query(getOverviewController)
})
