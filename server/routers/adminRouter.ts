import { publicProcedure, router } from '../trpc'
import { adminGetStructuresSchema, adminGetUsersSchema } from '~/server/schema'
import {
  getStructuresController,
  getUsersController
} from '~/server/controller/admin'

export const adminRouter = router({
  getStructures: publicProcedure
    .input(adminGetStructuresSchema)
    .query(getStructuresController),
  getUsers: publicProcedure.input(adminGetUsersSchema).query(getUsersController)
})
