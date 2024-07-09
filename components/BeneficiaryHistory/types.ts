import { RouterOutput } from '~/server/trpc/routers'

type SocialSupportsOutput = RouterOutput['file']['getSocialSupports']
export type SocialSupportItem = SocialSupportsOutput['items'][0]
export type SocialSupportData = SocialSupportItem['data']

export type FollowupData = NonNullable<SocialSupportData['followup']>
export type FileInstructionData = NonNullable<
  SocialSupportData['fileInstruction']
>

export type HelpRequestData = NonNullable<FileInstructionData['helpRequest']>
export type HousingHelpRequestData = NonNullable<
  FileInstructionData['housingHelpRequest']
>

export type CommentItems = Exclude<SocialSupportData['comments'], undefined>
export type CommentItem = CommentItems[number]
export type CommentData = CommentItem['comment']

export type DocumentItems = Exclude<SocialSupportData['documents'], undefined>
