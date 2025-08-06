import { z } from 'zod/v4'
import {
  Minister,
  SocialSupportStatus,
  FileInstructionType,
  HousingRoomCount,
  LowIncomeHousingType,
  BeneficiaryMinistereDepartementServiceAc,
  BeneficiaryMinistereStructure
} from '@prisma/client'
import dayjs from 'dayjs'
import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
import { withEmptyValueOptionalNativeEnum } from '../helpers.schema'
import { FileInstructionPeriodFilter } from '~/types/fileInstruction'

export const fileInstructionFilterSchema = z.object({
  fileInstructionType: z.enum(FileInstructionType).nullish(),
  status: z.enum(SocialSupportStatus).nullish(),
  socialSupportSubjects: z.array(z.uuid()).nullish(),
  createdById: z.array(z.uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  ministre: z.array(z.enum(Minister)).nullish(),
  ministereDepartementServiceAc: z
    .enum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.enum(BeneficiaryMinistereStructure).nullish(),
  roomCount: z.enum(HousingRoomCount).nullish(),
  lowIncomeHousingType: z.enum(LowIncomeHousingType).nullish(),
  notFilled: z.enum(FilterFileInstructionNotFilled).nullish(),
  period: withEmptyValueOptionalNativeEnum(FileInstructionPeriodFilter),
  fromDate: z.coerce.date().nullish(),
  toDate: z.coerce
    .date()
    .nullish()
    .transform(v => {
      if (v === undefined || v === null) {
        return v
      }
      return dayjs(v).hour(23).minute(59).second(59).toDate()
    })
})

export type FileInstructionFilterInput = z.infer<
  typeof fileInstructionFilterSchema
>
