import type { SocialSupportSubject } from '@prisma/client'

export const sortSocialSupportSubjectsByName = (
  socialSupportSujects: SocialSupportSubject[]
): SocialSupportSubject[] => {
  return socialSupportSujects.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}
