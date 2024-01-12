import { RouterOutput } from '~/server/trpc/routers'

type GetHistoryOutput = RouterOutput['beneficiary']['getSocialSupports']
export type HistoryItem = GetHistoryOutput['items'][0]
export type HistoryItemData = HistoryItem['data']
export type HistoryItemFollowup = NonNullable<HistoryItemData['followup']>
export type HistoryItemHelpRequest = NonNullable<HistoryItemData['helpRequest']>

export type HistoryItemComments = Exclude<
  HistoryItemData['comments'],
  undefined
>
export type HistoryItemComment = HistoryItemComments[number]
export type HistoryItemDocuments = Exclude<
  HistoryItemData['documents'],
  undefined
>
