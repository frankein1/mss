import { createStructure } from './createStructure.mutation'
import { createUser } from './createUser.mutation'
import { editUser } from './editUser.mutation'
import { getEmails } from './getEmails.query'
import { getOverview } from './getOverview.query'
import { getStructure } from './getStructure.query'
import { getStructures } from './getStructures.query'
import { getUser } from './getUser.query'
import { getUsers } from './getUsers.query'
import { sendEmail } from './sendEmail.query'
import { updateStructureInfo } from './updateStructureInfo.mutation'
import { updateSocialSupportSubjects } from './updateSocialSupportSubjects.mutation'
import { getSocialSupportSubjects } from './getSocialSupportSubjects.query'
import { makeInactiveSocialSupportSubject } from './makeInactiveSocialSupportSubject.mutation'
import { updateStructureSubject } from './updateSocialSupportSubject.mutation'
import { initSubjects } from './initSubjects.mutation'

export const adminRoutes = {
  createStructure,
  createUser,
  editUser,
  getEmails,
  getOverview,
  getStructure,
  getStructures,
  getUser,
  getUsers,
  sendEmail,
  updateStructureInfo,
  updateSocialSupportSubjects,
  getSocialSupportSubjects,
  makeInactiveSocialSupportSubject,
  updateStructureSubject,
  initSubjects
}
