import { adminProcedure, router } from '~/server/trpc'

import {
  createStructureMutation,
  createUserMutation,
  editStructureMutation,
  getStructuresQuery,
  getStructureQuery,
  getUsersQuery,
  getUserQuery,
  getOverviewQuery,
  editUserMutation
} from '~/server/request/admin'

export const adminRouter = router({
  createStructure: adminProcedure
    .input(createStructureMutation.inputValidation)
    .mutation(createStructureMutation.executeAsAdmin),
  getStructures: adminProcedure
    .input(getStructuresQuery.inputValidation)
    .query(getStructuresQuery.executeAsAdmin),
  getStructure: adminProcedure
    .input(getStructureQuery.inputValidation)
    .query(getStructureQuery.executeAsAdmin),
  editStructure: adminProcedure
    .input(editStructureMutation.inputValidation)
    .mutation(editStructureMutation.executeAsAdmin),
  createUser: adminProcedure
    .input(createUserMutation.inputValidation)
    .mutation(createUserMutation.executeAsAdmin),
  getUsers: adminProcedure
    .input(getUsersQuery.inputValidation)
    .query(getUsersQuery.executeAsAdmin),
  getUser: adminProcedure
    .input(getUserQuery.inputValidation)
    .query(getUserQuery.executeAsAdmin),
  editUser: adminProcedure
    .input(editUserMutation.inputValidation)
    .mutation(editUserMutation.executeAsAdmin),
  getOverview: adminProcedure
    .input(getOverviewQuery.inputValidation)
    .query(getOverviewQuery.executeAsAdmin)
})
