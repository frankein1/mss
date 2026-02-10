import type { SocialSupportSubject } from '~/prisma/generated/browser'

export type SocialSupportSubjectIdAndName = Pick<
  SocialSupportSubject,
  'id' | 'name'
>
