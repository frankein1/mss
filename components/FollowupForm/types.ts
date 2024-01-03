import { RouterOutput } from '~/server/trpc/routers'

type FollowupPage = RouterOutput['followup']['getPage']

export type FollowupPageItems = FollowupPage['items']
export type FollowupPageItem = FollowupPageItems[0]
