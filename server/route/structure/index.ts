import { findSocialSupportSubject } from './findSocialSupportSubject.query'
import { getActiveSocialSupportSubjects } from './getActiveSocialSupportSubjects.query'
import { getSocialSupportSubjects } from './getSocialSupportSubjects.query'
import { getStructure } from './getStructure.query'
import { getStructureDPOStatus } from './getStructureDPOStatus.query'
import { makeInactiveSocialSupportSubject } from './makeInactiveSocialSupportSubject.mutation'
import { updateStructureInfo } from './updateStructureInfo.mutation'
import { updateStructureSubject } from './updateSocialSupportSubject.mutation'
import { updateSocialSupportSubjects } from './updateSocialSupportSubjects.mutation'

export const structureRoutes = {
  findSocialSupportSubject,
  getActiveSocialSupportSubjects,
  getSocialSupportSubjects,
  getStructure,
  getStructureDPOStatus,
  makeInactiveSocialSupportSubject,
  updateStructureInfo,
  updateStructureSubject,
  updateSocialSupportSubjects
}
