import { z } from 'zod'
import {
  Minister,
  SocialSupportStatus,
  FileInstructionType
} from '@prisma/client'
import { kindOfBooleanSchema } from '..'

export const fileInstructionFilterSchema = z.object({
  fileInstructionType: z.nativeEnum(FileInstructionType).nullish(),
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  createdById: z.string().uuid().nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema(),
  externalStructure: kindOfBooleanSchema(),
  ministre: z.array(z.nativeEnum(Minister)).nullish()
})

export type FileInstructionFilterInput = z.infer<
  typeof fileInstructionFilterSchema
>
