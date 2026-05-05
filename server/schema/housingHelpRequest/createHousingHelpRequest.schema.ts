import {
  FileInstructionRefusalReason,
  SocialSupportStatus,
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
  stringConstraint,
  openRichText
} from '../helpers.schema'
import { errorMessages, maxStringLengthMessage } from '~/utils/zod'
import { SocialSupportRedirectionSchema } from '../redirection'

export const createHousingHelpRequestSchemaBase = z.object({
  familyFileId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  date: z.coerce.date(errorMessages),
  documents: z.array(z.string(), errorMessages).default([]),
  socialSupportRedirections: z.array(SocialSupportRedirectionSchema).nullish(),
  synthesis: openText(6000).nullish(),
  synthesisRichText: openRichText().nullish(),
  privateSynthesis: openText(6000).nullish(),
  privateSynthesisRichText: openRichText().nullish(),
  isMinistry: z.boolean(),
  ministerId: z.string().uuid().nullish(),
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
  handlingDate: dateOrEmpty,
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
  lowIncomeHousingType: z.array(z.nativeEnum(LowIncomeHousingType)).nullish(),
  beneficiaryDeviceId: z.string().nullish()
})

export const createHousingHelpRequestSchema = z.discriminatedUnion(
  'isMinistry',
  [
    createHousingHelpRequestSchemaBase.extend({
      isMinistry: z.literal(true) as z.ZodLiteral<boolean>,
      ministerId: z
        .string({
          required_error: 'Veuillez renseigner ce champ.',
          invalid_type_error: 'Veuillez renseigner ce champ.'
        })
        .min(1, 'Veuillez renseigner ce champ.')
        .uuid('Veuillez renseigner ce champ.')
    }),
    createHousingHelpRequestSchemaBase.extend({
      isMinistry: z.literal(false) as z.ZodLiteral<boolean>,
      ministerId: z.string().uuid().nullish()
    })
  ]
)

export type CreateHousingHelpRequestInput = z.infer<
  typeof createHousingHelpRequestSchema
>
