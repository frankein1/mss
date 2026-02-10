import type { RouterOutput } from '~/server/trpc/routers'

type FollowupPage = RouterOutput['followup']['getPage']

export type FollowupPageItems = FollowupPage['items']
export type FollowupPageItem = FollowupPageItems[0]

// TODO: move to Minister component directory
export type MinistersOutput = RouterOutput['minister']['getMinisters']
export type MinisterOutput = RouterOutput['minister']['getMinisters'][0]
