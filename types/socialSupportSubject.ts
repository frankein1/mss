import { SocialSupportSubject } from '@prisma/client'

export type SocialSupportSubjectIdAndName = Pick<
  SocialSupportSubject,
  'id' | 'name'
>
