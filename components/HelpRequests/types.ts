import type { GetHelpRequestsOutput } from '~/server/trpc/routers'

export type HelpRequests = GetHelpRequestsOutput['helpRequests']
export type HelpRequestItem = HelpRequests[0]
