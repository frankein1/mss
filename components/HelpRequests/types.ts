import { RouterOutput } from '~/server/trpc/routers'

export type GetHelpRequestsOutput =
  RouterOutput['helpRequest']['getHelpRequests']

export type HelpRequests = GetHelpRequestsOutput['helpRequests']
export type HelpRequestItem = HelpRequests[0]
