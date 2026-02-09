import type { SocialSupportSubject } from '~/prisma/generated/client'

export type SocialSupportSubjectIdAndName = Pick<
  SocialSupportSubject,
  'id' | 'name'
>
