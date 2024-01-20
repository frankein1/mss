import { RouterOutput } from '~/server/trpc/routers'

type HousingHelpRequestPage = RouterOutput['housingHelpRequest']['getPage']

export type HousingHelpRequestPageItems = HousingHelpRequestPage['items']
export type HousingHelpRequestPageItem = HousingHelpRequestPageItems[0]
