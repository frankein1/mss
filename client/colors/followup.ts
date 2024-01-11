import { SocialSupportStatus } from '@prisma/client'

export const followupStatusColors = {
  [SocialSupportStatus.Todo]: '#3bea7e',
  [SocialSupportStatus.InProgress]: '#7AB1E8',
  [SocialSupportStatus.Done]: '#6f45f7'
}
