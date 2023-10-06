import { adminProcedure, router } from '~/server/trpc'

import {
  createAdminStructureMutation,
  createAdminUserMutation,
  editAdminStructureMutation,
  getAdminStructuresQuery,
  getAdminStructureQuery,
  getAdminUsersQuery,
  getAdminUserQuery,
  getAdminOverviewQuery,
  editAdminUserMutation
} from '~/server/route/admin'

export const adminRouter = router({
  createStructure: adminProcedure
    .input(createAdminStructureMutation.inputValidation)
    .mutation(createAdminStructureMutation.executeAsAdmin),
  getStructures: adminProcedure
    .input(getAdminStructuresQuery.inputValidation)
    .query(getAdminStructuresQuery.executeAsAdmin),
  getStructure: adminProcedure
    .input(getAdminStructureQuery.inputValidation)
    .query(getAdminStructureQuery.executeAsAdmin),
  editStructure: adminProcedure
    .input(editAdminStructureMutation.inputValidation)
    .mutation(editAdminStructureMutation.executeAsAdmin),
  createUser: adminProcedure
    .input(createAdminUserMutation.inputValidation)
    .mutation(createAdminUserMutation.executeAsAdmin),
  getUsers: adminProcedure
    .input(getAdminUsersQuery.inputValidation)
    .query(getAdminUsersQuery.executeAsAdmin),
  getUser: adminProcedure
    .input(getAdminUserQuery.inputValidation)
    .query(getAdminUserQuery.executeAsAdmin),
  editUser: adminProcedure
    .input(editAdminUserMutation.inputValidation)
    .mutation(editAdminUserMutation.executeAsAdmin),
  getOverview: adminProcedure
    .input(getAdminOverviewQuery.inputValidation)
    .query(getAdminOverviewQuery.executeAsAdmin)
})
