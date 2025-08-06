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
import { z } from 'zod/v4'
import {
  numeroPegaseContraint,
  withEmptyValueOptionalNativeEnum,
  kindOfBooleanSchema,
  requiredNativeEnum,
  amountNumber,
  dateOrEmpty,
  openText,
  stringOrEmpty,
  stringConstraint,
  openRichText
} from '../helpers.schema'
import {
  errorMessages,
  requiredErrorMessage,
  maxStringLengthMessage
} from '~/utils/zod'

export const createHousingHelpRequestSchemaBase = z.object({
  familyFileId: z.uuid(),
  beneficiaryId: z.uuid(),
  date: z.coerce.date(errorMessages),
  documents: z.array(z.string(), errorMessages).prefault([]),
  synthesis: openText(6000).nullish(),
  synthesisRichText: openRichText().nullish(),
  privateSynthesis: openText(6000).nullish(),
  privateSynthesisRichText: openRichText().nullish(),
  isMinistry: z.boolean(),
  ministre: withEmptyValueOptionalNativeEnum(Minister),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  status: requiredNativeEnum(SocialSupportStatus),
  dueDate: dateOrEmpty,
  prescribingOrganizationId: z.string().nullish(),
  prescribingOrganizationContactId: z.string().nullish(),
  instructorOrganizationId: z.string().nullish(),
  instructorOrganizationContactId: z.string().nullish(),
  externalStructure: kindOfBooleanSchema(true),
  examinationDate: dateOrEmpty,
  decisionDate: dateOrEmpty,
  refusalReason: withEmptyValueOptionalNativeEnum(FileInstructionRefusalReason),
  dispatchDate: dateOrEmpty,
  fullFile: z.boolean().prefault(false),
  isFirst: kindOfBooleanSchema(),
  firstOpeningDate: dateOrEmpty,
  [AskedHousing.HebergementTemporaire]: z.boolean().prefault(false),
  [AskedHousing.ParcPrive]: z.boolean().prefault(false),
  [AskedHousing.ParcSocial]: z.boolean().prefault(false),
  reason: withEmptyValueOptionalNativeEnum(HousingReason),
  uniqueId: stringConstraint.max(150, maxStringLengthMessage(50)).nullish(),
  taxHouseholdAdditionalInformation: openText(200).nullish(),
  maxRent: amountNumber.nullish(),
  maxCharges: amountNumber.nullish(),
  housingType: z.array(z.enum(HousingType)).nullish(),
  roomCount: z.array(z.enum(HousingRoomCount)).nullish(),
  isPmr: z.boolean().prefault(false),
  lowIncomeHousingType: z.array(z.enum(LowIncomeHousingType)).nullish()
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
