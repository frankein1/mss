import { z } from 'zod'
import {
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
import { FileInstructionPeriodFilter } from '~~/types/fileInstruction'

export const fileInstructionFilterSchema = z.object({
  fileInstructionType: z.nativeEnum(FileInstructionType).nullish(),
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  createdById: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  ministerId: z.array(z.string().uuid()).nullish(),
  ministereDepartementServiceAc: z
    .nativeEnum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.nativeEnum(BeneficiaryMinistereStructure).nullish(),
  roomCount: z.nativeEnum(HousingRoomCount).nullish(),
  lowIncomeHousingType: z.nativeEnum(LowIncomeHousingType).nullish(),
  notFilled: z.nativeEnum(FilterFileInstructionNotFilled).nullish(),
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
