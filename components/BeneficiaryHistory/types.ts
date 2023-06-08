import type { GetBeneficiaryHistoryOutput } from '~/server/routers'

export type HistoryItem = GetBeneficiaryHistoryOutput[0]
export type HistoryItemComments = HistoryItem['comments']
export type HistoryItemComment = HistoryItemComments[0]
