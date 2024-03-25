import { update } from './update.service'
import { getCreateSocialSupportSubjects } from './getCreateSocialSupportSubjects.service'
import { makeInactive } from './makeInactive.service'

export const SocialSupportSubjectService = {
  update,
  makeInactive,
  getCreateSocialSupportSubjects
}
