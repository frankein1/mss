import { adminProcedure, router } from '~/server/trpc'

import {
  createAdminStructureMutation,
  createAdminUserMutation,
  editAdminStructureMutation,
  getAdminStructuresQuery,
  getStructure,
  getAdminUsersQuery,
  getAdminUserQuery,
  getAdminOverviewQuery,
  editAdminUserMutation,
  getAdminEmailsQuery,
  sendEmailQuery
} from '~/server/route/admin'

export const adminRouter = router({
  createStructure: adminProcedure
    .input(createAdminStructureMutation.inputValidation)
    .mutation(createAdminStructureMutation.executeAsAdmin),
  getStructures: adminProcedure
    .input(getAdminStructuresQuery.inputValidation)
    .query(getAdminStructuresQuery.executeAsAdmin),
  getStructure: adminProcedure
    .input(getStructure.inputValidation)
    .query(getStructure.executeAsAdmin),
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
  getEmails: adminProcedure
    .input(getAdminEmailsQuery.inputValidation)
    .query(getAdminEmailsQuery.executeAsAdmin),
  sendEmail: adminProcedure
    .input(sendEmailQuery.inputValidation)
    .mutation(sendEmailQuery.executeAsAdmin),
  getOverview: adminProcedure
    .input(getAdminOverviewQuery.inputValidation)
    .query(getAdminOverviewQuery.executeAsAdmin)
})
