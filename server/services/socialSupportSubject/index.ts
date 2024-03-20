import { update } from './update.service'
import { get } from './get.service'
import { getCreateSocialSupportSubjects } from './getCreateSocialSupportSubjects.service'
import { makeInactive } from './makeInactive.service'

export const SocialSupportSubjectService = {
  get,
  update,
  makeInactive,
  getCreateSocialSupportSubjects
}
