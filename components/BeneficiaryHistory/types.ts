import { FollowupMedium } from '@prisma/client'
import { RouterOutput } from '~/server/trpc/routers'

type GetHistoryOutput = RouterOutput['beneficiary']['getBeneficiaryHistories']
export type HistoryItem = GetHistoryOutput['histories'][0]
export type FollowupHistoryItem = HistoryItem & {
  isFollowup: true
  medium: FollowupMedium
}
export type HelpRequestHistoryItem = HistoryItem & { isFollowup: false }

export type HistoryItemComments = Exclude<HistoryItem['comments'], undefined>
export type HistoryItemComment = HistoryItemComments[number]
export type HistoryItemDocuments = Exclude<HistoryItem['documents'], undefined>
