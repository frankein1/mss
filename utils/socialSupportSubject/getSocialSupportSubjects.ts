import type { SocialSupportSubject } from '@prisma/client'
import { sortSocialSupportSubjectsByName } from '.'

export function getSocialSupportSubjects<
  T extends Pick<SocialSupportSubject, 'id' | 'name'>
>(
  activeSocialSupportSubjects: T[] | undefined,
  activeAndInactivSocialSupportSubjects: T[] | undefined,
  userSubjectId: string | undefined
) {
  if (
    !userSubjectId ||
    !activeAndInactivSocialSupportSubjects ||
    !activeSocialSupportSubjects
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

export function getSocialSupportSubjectsFromArray<
  T extends Pick<SocialSupportSubject, 'id' | 'name'>
>(
  activeSocialSupportSubjects: T[] | undefined,
  activeAndInactivSocialSupportSubjects: T[] | undefined,
  userSocialSupportSubjects: T[] | undefined
): T[] | null {
  if (
    !userSocialSupportSubjects ||
    !activeAndInactivSocialSupportSubjects ||
    !activeSocialSupportSubjects
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
