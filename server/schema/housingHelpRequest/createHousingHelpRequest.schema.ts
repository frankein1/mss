import {
  FileInstructionRefusalReason,
  SocialSupportStatus,
  Minister,
  AskedHousing,
  HousingReason,
  HousingType,
  HousingRoomCount,
  LowIncomeHousingType
} from '@prisma/client'
import { z } from 'zod'
import {
  numeroPegaseContraint,
  withEmptyValueOptionalNativeEnum,
  kindOfBooleanSchema,
  requiredNativeEnum,
  amountNumber,
  dateOrEmpty,
  openText,
  stringOrEmpty,
  stringConstraint
} from '../helpers.schema'
import {
  errorMessages,
  requiredErrorMessage,
  maxStringLengthMessage
} from '~/utils/zod'

export const createHousingHelpRequestSchemaBase = z.object({
  beneficiaryId: z.string().uuid(),
  date: z.coerce.date(errorMessages),
  documents: z.array(z.string(), errorMessages).default([]),
  synthesis: openText(6000).nullish(),
  privateSynthesis: openText(1000).nullish(),
  isMinistry: z.boolean(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  status: requiredNativeEnum(SocialSupportStatus),
  dueDate: dateOrEmpty,
  instructorOrganizationId: z.string().nullish(),
  instructorOrganizationContactId: z.string().nullish(),
  externalStructure: kindOfBooleanSchema(true),
  examinationDate: dateOrEmpty,
  decisionDate: dateOrEmpty,
  refusalReason: withEmptyValueOptionalNativeEnum(FileInstructionRefusalReason),
  dispatchDate: dateOrEmpty,
  fullFile: z.boolean().default(false),
  isFirst: kindOfBooleanSchema(),
  firstOpeningDate: dateOrEmpty,
  [AskedHousing.HebergementTemporaire]: z.boolean().default(false),
  [AskedHousing.ParcPrive]: z.boolean().default(false),
  [AskedHousing.ParcSocial]: z.boolean().default(false),
  reason: withEmptyValueOptionalNativeEnum(HousingReason),
  uniqueId: stringConstraint.max(150, maxStringLengthMessage(50)).nullish(),
  taxHouseholdAdditionalInformation: openText(200).nullish(),
  maxRent: amountNumber.nullish(),
  maxCharges: amountNumber.nullish(),
  housingType: z.array(z.nativeEnum(HousingType)).nullish(),
  roomCount: z.array(z.nativeEnum(HousingRoomCount)).nullish(),
  isPmr: z.boolean().default(false),
  lowIncomeHousingType: z.array(z.nativeEnum(LowIncomeHousingType)).nullish()
})

export const createHousingHelpRequestSchema =
  createHousingHelpRequestSchemaBase.refine(
    val => !val.isMinistry || val.ministre,
    {
      message: requiredErrorMessage,
      path: ['ministre']
    }
  )

export type CreateHousingHelpRequestInput = z.infer<
  typeof createHousingHelpRequestSchema
>
