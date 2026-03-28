import type { SocialSupportSubject } from '@prisma/client'

export function sortSocialSupportSubjectsByName<
  T extends Pick<SocialSupportSubject, 'name'>
>(socialSupportSujects: T[]) {
  return socialSupportSujects.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}
