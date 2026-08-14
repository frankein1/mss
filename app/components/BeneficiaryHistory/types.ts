import type { RouterOutput } from '~~/server/trpc/routers'

type SocialSupportsOutput = RouterOutput['file']['getSocialSupports']
export type SocialSupportItem = SocialSupportsOutput[0]
export type SocialSupportData = SocialSupportItem

type SocialSupportDetailOutput = RouterOutput['socialSupport']['getDetails']
export type SocialSupportDetailItem = SocialSupportDetailOutput
export type SocialSupportDetailData = SocialSupportDetailItem['data']

export type FollowupData = NonNullable<SocialSupportDetailData['followup']>
export type FileInstructionData = NonNullable<
  SocialSupportDetailData['fileInstruction']
>

export type HelpRequestData = NonNullable<FileInstructionData['helpRequest']>
export type HousingHelpRequestData = NonNullable<
  FileInstructionData['housingHelpRequest']
>

export type CommentItems = Exclude<
  SocialSupportDetailData['comments'],
  undefined
>
export type CommentItem = CommentItems[number]
export type CommentData = CommentItem['comment']

export type DocumentItems = Exclude<
  SocialSupportDetailData['documents'],
  undefined
>

export type SocialSupportRedirectionsDetails =
  SocialSupportDetailOutput['data']['socialSupportRedirections']
