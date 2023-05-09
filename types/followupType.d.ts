import { FollowupType } from '@prisma/client'

export type FollowupTypeWithSupportsCount = FollowupType & {
  _count: {
    followups: number
    helpRequests: number
  }
}
