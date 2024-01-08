import { RouterOutput } from '~/server/trpc/routers'

type HelpRequestPage = RouterOutput['helpRequest']['getPage']

export type HelpRequestPageItems = HelpRequestPage['items']
export type HelpRequestPageItem = HelpRequestPageItems[0]
