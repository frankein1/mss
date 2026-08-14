import type { SocialSupportSubject } from '@prisma/client'
import { sortSocialSupportSubjectsByName } from './sortSocialSupportSubjectsByName'

export const getSocialSupportSubjects = (
  activeSocialSupportSubjects: SocialSupportSubject[] | null,
  activeAndInactivSocialSupportSubjects: SocialSupportSubject[] | null,
  userSubjectId: string | undefined
): SocialSupportSubject[] | null => {
  if (
    userSubjectId == null ||
    activeAndInactivSocialSupportSubjects == null ||
    activeSocialSupportSubjects == null
  ) {
    return null
  }

  const allSocialSupportSubjects = activeSocialSupportSubjects || []

  const foundInActive = activeSocialSupportSubjects.find(
    subject => subject.id === userSubjectId
  )
  if (foundInActive != null) {
    return activeSocialSupportSubjects
  }
  const foundInAll = activeAndInactivSocialSupportSubjects.find(
    subject => subject.id === userSubjectId
  )
  if (foundInAll == null) {
    return activeSocialSupportSubjects
  }
  allSocialSupportSubjects.push(foundInAll)
  return sortSocialSupportSubjectsByName(allSocialSupportSubjects)
}

export const getSocialSupportSubjectsFromArray = (
  activeSocialSupportSubjects: SocialSupportSubject[] | null,
  activeAndInactivSocialSupportSubjects: SocialSupportSubject[] | null,
  userSocialSupportSubjects: SocialSupportSubject[] | undefined
): SocialSupportSubject[] | null => {
  if (
    userSocialSupportSubjects == null ||
    activeAndInactivSocialSupportSubjects == null ||
    activeSocialSupportSubjects == null
  ) {
    return null
  }

  const idsUse = userSocialSupportSubjects.map(subject => subject.id)
  const foundInActive = activeSocialSupportSubjects.filter(subject =>
    idsUse.includes(subject.id)
  )

  const idsAll = activeAndInactivSocialSupportSubjects.map(
    subject => subject.id
  )
  const foundInAll = userSocialSupportSubjects.filter(subject =>
    idsAll.includes(subject.id)
  )

  if (foundInAll == null) {
    return activeSocialSupportSubjects
  }

  const foundInActiveIds = foundInActive.map(item => item.id)
  const difference = foundInAll.filter(
    item => !foundInActiveIds.includes(item.id)
  )

  const allSocialSupportSubjects = [
    ...activeSocialSupportSubjects,
    ...difference
  ]

  return sortSocialSupportSubjectsByName(allSocialSupportSubjects)
}
