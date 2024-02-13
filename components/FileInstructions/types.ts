import { RouterOutput } from '~/server/trpc/routers'

type FileInstructionPage = RouterOutput['fileInstruction']['getPage']

export type FileInstructionPageItems = FileInstructionPage['items']
export type FileInstructionPageItem = FileInstructionPageItems[0]
export type FileInstructionPageItemData =
  FileInstructionPageItem['fileInstruction']

export type HelpRequestData = NonNullable<
  FileInstructionPageItemData['helpRequest']
>
