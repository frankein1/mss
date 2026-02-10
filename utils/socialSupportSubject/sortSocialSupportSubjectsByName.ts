import type { SocialSupportSubject } from '~/prisma/generated/browser'

export const sortSocialSupportSubjectsByName = (
  socialSupportSujects: SocialSupportSubject[]
): SocialSupportSubject[] => {
  return socialSupportSujects.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}
