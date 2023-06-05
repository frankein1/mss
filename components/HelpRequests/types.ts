import type { GetHelpRequestsOutput } from '~/server/routers'

export type HelpRequests = GetHelpRequestsOutput['helpRequests']
export type HelpRequestItem = HelpRequests[0]
