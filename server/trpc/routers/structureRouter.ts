import { protectedProcedure, router } from '~/server/trpc'
import {
  findSocialSupportSubject,
  getCreateSocialSupportSubjects,
  getSocialSupportSubject,
  getStructure,
  makeInactiveSocialSupportSubject,
  updateSocialSupportSubject,
  updateSocialSupportSubjects,
  updateStructureInfo,
  getActiveSocialSupportSubjects,
  getSocialSupportSubjects
} from '~/server/route/structure'

export const structureRouter = router({
  getStructure: protectedProcedure
    .input(getStructure.inputValidation)
    .query(getStructure.execute),
  updateStructureInfo: protectedProcedure
    .input(updateStructureInfo.inputValidation)
    .mutation(updateStructureInfo.execute),
  findSocialSupportSubject: protectedProcedure
    .input(findSocialSupportSubject.inputValidation)
    .query(findSocialSupportSubject.execute),
  updateSocialSupportSubjects: protectedProcedure
    .input(updateSocialSupportSubjects.inputValidation)
    .mutation(updateSocialSupportSubjects.execute),
  getCreateSocialSupportSubjects: protectedProcedure
    .input(getCreateSocialSupportSubjects.inputValidation)
    .query(getCreateSocialSupportSubjects.execute),
  getSocialSupportSubject: protectedProcedure
    .input(getSocialSupportSubject.inputValidation)
    .query(getSocialSupportSubject.execute),
  makeInactiveSocialSupportSubject: protectedProcedure
    .input(makeInactiveSocialSupportSubject.inputValidation)
    .mutation(makeInactiveSocialSupportSubject.execute),
  updateSocialSupportSubject: protectedProcedure
    .input(updateSocialSupportSubject.inputValidation)
    .mutation(updateSocialSupportSubject.execute),
  getActiveSocialSupportSubjects: protectedProcedure
    .input(getActiveSocialSupportSubjects.inputValidation)
    .query(getActiveSocialSupportSubjects.execute),
  getSocialSupportSubjects: protectedProcedure
    .input(getSocialSupportSubjects.inputValidation)
    .query(getSocialSupportSubjects.execute)
})
