import { z } from 'zod'
import {
  Minister,
  SocialSupportStatus,
  FileInstructionType,
  HousingRoomCount,
  LowIncomeHousingType
} from '@prisma/client'

export const fileInstructionFilterSchema = z.object({
  fileInstructionType: z.nativeEnum(FileInstructionType).nullish(),
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  createdById: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  ministre: z.array(z.nativeEnum(Minister)).nullish(),
  roomCount: z.nativeEnum(HousingRoomCount).nullish(),
  lowIncomeHousingType: z.nativeEnum(LowIncomeHousingType).nullish()
})

export type FileInstructionFilterInput = z.infer<
  typeof fileInstructionFilterSchema
>
