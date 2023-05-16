import type { GetFollowupsOutput } from '~/server/routers'

export type Followups = GetFollowupsOutput['followups']
export type FollowupItem = Followups[0]
