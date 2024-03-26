import { findSocialSupportSubject } from './findSocialSupportSubject.query'
import { getActiveSocialSupportSubjects } from './getActiveSocialSupportSubjects.query'
import { getCreateSocialSupportSubjects } from './getCreateSocialSupportSubjects.query'
import { getSocialSupportSubjects } from './getSocialSupportSubjects.query'
import { getStructure } from './getStructure.query'
import { makeInactiveSocialSupportSubject } from './makeInactiveSocialSupportSubject.mutation'
import { updateStructureInfo } from './updateStructureInfo.mutation'
import { updateStructureSubject } from './updateSocialSupportSubject.mutation'
import { updateSocialSupportSubjects } from './updateSocialSupportSubjects.mutation'

export const structureRoutes = {
  findSocialSupportSubject,
  getActiveSocialSupportSubjects,
  getCreateSocialSupportSubjects,
  getSocialSupportSubjects,
  getStructure,
  makeInactiveSocialSupportSubject,
  updateStructureInfo,
  updateStructureSubject,
  updateSocialSupportSubjects
}
