import { FollowupType } from '@prisma/client'

export type FollowupTypeWithSupportsCount = FollowupType & {
  _count: {
    followups: number
    helpRequests: number
  }
}

export type FollowupTypeIdAndName = Pick<FollowupType, 'id' | 'name'>
