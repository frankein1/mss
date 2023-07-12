import { adminProcedure, router } from '~/server/trpc'
import {
  adminCreateStructureSchema,
  adminCreateUserSchema,
  adminEditStructureSchema,
  adminEditUserSchema,
  adminGetStructuresSchema,
  adminGetUsersSchema,
  idSchema
} from '~/server/schema'
import {
  createStructureController,
  createUserController,
  editStructureController,
  getStructuresController,
  getStructureController,
  getUsersController,
  getUserController,
  getOverviewController,
  editUserController
} from '~/server/controller/admin'

export const adminRouter = router({
  createStructure: adminProcedure
    .input(adminCreateStructureSchema)
    .mutation(createStructureController),
  getStructures: adminProcedure
    .input(adminGetStructuresSchema)
    .query(getStructuresController),
  getStructure: adminProcedure.input(idSchema).query(getStructureController),
  editStructure: adminProcedure
    .input(adminEditStructureSchema)
    .mutation(editStructureController),
  createUser: adminProcedure
    .input(adminCreateUserSchema)
    .mutation(createUserController),
  getUsers: adminProcedure.input(adminGetUsersSchema).query(getUsersController),
  getUser: adminProcedure.input(idSchema).query(getUserController),
  editUser: adminProcedure
    .input(adminEditUserSchema)
    .mutation(editUserController),
  getOverview: adminProcedure.query(getOverviewController)
})
