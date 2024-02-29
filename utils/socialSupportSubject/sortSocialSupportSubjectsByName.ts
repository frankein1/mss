import { SocialSupportSubjectIdAndName } from '~/types/socialSupportSubject'

export function sortSocialSupportSubjectsByName(
  a: SocialSupportSubjectIdAndName,
  b: SocialSupportSubjectIdAndName
) {
  const insensitiveAName = a.name.toLowerCase()
  const insensitiveBName = b.name.toLowerCase()

  if (insensitiveAName < insensitiveBName) {
    return -1
  }
  if (insensitiveAName > insensitiveBName) {
    return 1
  }
  return 0
}
