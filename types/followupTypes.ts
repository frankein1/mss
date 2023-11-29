import { FollowupType } from '@prisma/client'

export type FollowupTypeIdAndName = Pick<FollowupType, 'id' | 'name'>
