import { FollowupMedium } from '@prisma/client'
import { RouterOutput } from '~/server/trpc/routers'

type GetHistoryOutput = RouterOutput['beneficiary']['getBeneficiaryHistories']
export type HistoryItem = GetHistoryOutput['histories'][0]
export type HistoryItemData = HistoryItem['data']
export type FollowupHistoryItem = HistoryItemData & {
  medium: FollowupMedium
}

export type HistoryItemComments = Exclude<
  HistoryItemData['comments'],
  undefined
>
export type HistoryItemComment = HistoryItemComments[number]
export type HistoryItemDocuments = Exclude<
  HistoryItemData['documents'],
  undefined
>
