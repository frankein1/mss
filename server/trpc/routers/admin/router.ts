import { adminProcedure, router } from '~/server/trpc'

import { adminRoutes } from '~/server/route'

export const adminRouter = router({
  createStructure: adminProcedure
    .input(adminRoutes.createStructure.inputValidation)
    .mutation(adminRoutes.createStructure.executeAsAdmin),
  getStructures: adminProcedure
    .input(adminRoutes.getStructures.inputValidation)
    .query(adminRoutes.getStructures.executeAsAdmin),
  getStructure: adminProcedure
    .input(adminRoutes.getStructure.inputValidation)
    .query(adminRoutes.getStructure.executeAsAdmin),
  createUser: adminProcedure
    .input(adminRoutes.createUser.inputValidation)
    .mutation(adminRoutes.createUser.executeAsAdmin),
  getUsers: adminProcedure
    .input(adminRoutes.getUsers.inputValidation)
    .query(adminRoutes.getUsers.executeAsAdmin),
  getUser: adminProcedure
    .input(adminRoutes.getUser.inputValidation)
    .query(adminRoutes.getUser.executeAsAdmin),
  editUser: adminProcedure
    .input(adminRoutes.editUser.inputValidation)
    .mutation(adminRoutes.editUser.executeAsAdmin),
  getEmails: adminProcedure
    .input(adminRoutes.getEmails.inputValidation)
    .query(adminRoutes.getEmails.executeAsAdmin),
  sendEmail: adminProcedure
    .input(adminRoutes.sendEmail.inputValidation)
    .mutation(adminRoutes.sendEmail.executeAsAdmin),
  getOverview: adminProcedure
    .input(adminRoutes.getOverview.inputValidation)
    .query(adminRoutes.getOverview.executeAsAdmin),
  updateStructureInfo: adminProcedure
    .input(adminRoutes.updateStructureInfo.inputValidation)
    .mutation(adminRoutes.updateStructureInfo.executeAsAdmin),
  updateSocialSupportSubjects: adminProcedure
    .input(adminRoutes.updateSocialSupportSubjects.inputValidation)
    .mutation(adminRoutes.updateSocialSupportSubjects.executeAsAdmin),
  getSocialSupportSubjects: adminProcedure
    .input(adminRoutes.getSocialSupportSubjects.inputValidation)
    .query(adminRoutes.getSocialSupportSubjects.executeAsAdmin),
  makeInactiveSocialSupportSubject: adminProcedure
    .input(adminRoutes.makeInactiveSocialSupportSubject.inputValidation)
    .mutation(adminRoutes.makeInactiveSocialSupportSubject.executeAsAdmin),
  updateSocialSupportSubject: adminProcedure
    .input(adminRoutes.updateStructureSubject.inputValidation)
    .mutation(adminRoutes.updateStructureSubject.executeAsAdmin)
})
