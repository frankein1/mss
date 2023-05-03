import { FollowupStatus } from '@prisma/client'

export const followupStatusColors: { [key in FollowupStatus]: string } = {
  [FollowupStatus.Todo]: '#3bea7e',
  [FollowupStatus.InProgress]: '#7AB1E8',
  [FollowupStatus.Done]: '#6f45f7'
}
