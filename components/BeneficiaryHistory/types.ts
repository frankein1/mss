import type { HistoryItem } from '~/server/route'

export type { HistoryItem } from '~/server/route'
export type HistoryItemComments = Exclude<HistoryItem['comments'], undefined>
export type HistoryItemComment = HistoryItemComments[number]
export type HistoryItemDocuments = HistoryItem['documents']
