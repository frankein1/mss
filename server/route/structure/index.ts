import { searchSocialSupportSubjects } from './search-social-support-subjects.query'
import { getActiveSocialSupportSubjects } from './getActiveSocialSupportSubjects.query'
import { getActiveOrUsedSocialSupportSubjects } from './getActiveOrUsedSocialSupportSubjects.query'

import { getSocialSupportSubjects } from './getSocialSupportSubjects.query'
import { getStructure } from './getStructure.query'
import { getStructureDPOStatus } from './getStructureDPOStatus.query'
import { makeInactiveSocialSupportSubject } from './makeInactiveSocialSupportSubject.mutation'
import { updateStructureInfo } from './updateStructureInfo.mutation'
import { updateStructureSubject } from './updateSocialSupportSubject.mutation'
import { updateSocialSupportSubjects } from './updateSocialSupportSubjects.mutation'

export const structureRoutes = {
  searchSocialSupportSubjects,
  getActiveSocialSupportSubjects,
  getActiveOrUsedSocialSupportSubjects,
  getSocialSupportSubjects,
  getStructure,
  getStructureDPOStatus,
  makeInactiveSocialSupportSubject,
  updateStructureInfo,
  updateStructureSubject,
  updateSocialSupportSubjects
}
