import {
  BeneficiaryAccommodationMode,
  BeneficiaryAccommodationZone,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  Gender,
  IncomeSource,
  BeneficiaryPensionOrganisation,
  BeneficiaryTitle,
  Nationality,
  Prisma,
  BeneficiaryMinistereStructure,
  BeneficiaryMinistereCategorie,
  BeneficiaryMinistereDepartementServiceAc
} from '@prisma/client'
import { z } from 'zod'
import {
  createOrUpdateEntourageSchema,
  createOrUpdateTaxHouseholdSchema
} from './relative.schema'
import {
  beneficiaryFilterSchema,
  beneficiaryHistoryFilterSchema
} from './filter.schema'
import { paginatedSchema } from './helpers.schema'
import {
  errorMessages,
  validZipcode,
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum
} from '~/utils/zod'
import { isValidEmail } from '~/utils/isValidEmail'
import { isValidZipCode } from '~/utils/isValidZipCode'

export const getDocumentsSchema = z.object({
  beneficiaryId: z.string()
})

type GetDocumentsInput = z.infer<typeof getDocumentsSchema>

export const getHistorySchema = z.object({
  beneficiaryId: z.string(),
  filters: beneficiaryHistoryFilterSchema
})

type GetHistoryInput = z.infer<typeof getHistorySchema>

export type { GetDocumentsInput, GetHistoryInput }

export const searchBeneficiarySchema = z.object({
  query: z.string(),
  excludedIds: z.array(z.string().uuid()).optional()
})

export type SearchBeneficiaryInput = z.infer<typeof searchBeneficiarySchema>

const beneficiaryLastNameSchema = z.string().toUpperCase().nullish()
const beneficiaryFirstNameSchema = z
  .string()
  .nullish()
  .transform(v => {
    if (!v) {
      return v
    }
    const [firstLetter, ...rest] = v
    return `${firstLetter.toUpperCase()}${rest.join('')}`
  })

export const createBeneficiarySchema = z.object({
  status: requiredNativeEnum(BeneficiaryStatus),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  usualName: beneficiaryLastNameSchema,
  birthName: beneficiaryLastNameSchema,
  firstName: beneficiaryFirstNameSchema,
  birthDate: z.coerce.date(errorMessages).nullish(),
  phone1: z.string().nullish(),
  email: z.custom(value => {
    return isValidEmail(value as string)
  }, 'Email non valide'),
  numeroPegase: z.string().nullish()
})

type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>

export type { CreateBeneficiaryInput }

export const updateBeneficiarySchema = z.object({
  id: z.string().uuid(),
  structureId: z.string().uuid(),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),

  // General information
  general: z.object({
    status: requiredNativeEnum(BeneficiaryStatus),
    title: withEmptyValueOptionalNativeEnum(BeneficiaryTitle),
    firstName: beneficiaryFirstNameSchema,
    usualName: beneficiaryLastNameSchema,
    birthName: beneficiaryLastNameSchema,
    birthDate: z.coerce.date(errorMessages).nullish(),
    birthPlace: z.string().nullish(),
    deathDate: z.date(errorMessages).nullish(),
    gender: withEmptyValueOptionalNativeEnum(Gender),
    nationality: withEmptyValueOptionalNativeEnum(Nationality),
    numeroPegase: z.string().nullish(),
    accommodationMode: withEmptyValueOptionalNativeEnum(
      BeneficiaryAccommodationMode
    ),
    accommodationName: z.string().nullish(),
    accommodationAdditionalInformation: z.string().nullish(),
    zipcode: z.custom(value => {
      return isValidZipCode(value as string)
    }, validZipcode),
    city: z.string().nullish(),
    region: z.string().nullish(),
    accommodationZone: withEmptyValueOptionalNativeEnum(
      BeneficiaryAccommodationZone
    ),
    streetNumber: z.string().nullish(),
    street: z.string().nullish(),
    addressComplement: z.string().nullish(),
    noPhone: z.boolean().default(false),
    phone1: z.string().nullish(),
    phone2: z.string().nullish(),
    email: z.custom(value => {
      return isValidEmail(value as string)
    }, 'Email non valide'),
    caregiver: z.boolean().default(false),
    mobility: withEmptyValueOptionalNativeEnum(BeneficiaryMobility)
  }),
  taxHousehold: z.object({
    familySituation: withEmptyValueOptionalNativeEnum(
      BeneficiaryFamilySituation
    ),
    minorChildren: z.coerce.number().gte(0).nullish(),
    majorChildren: z.coerce.number().gte(0).nullish(),
    taxHouseholds: z.array(createOrUpdateTaxHouseholdSchema).nullish()
  }),
  entourage: z.object({
    entourages: z.array(createOrUpdateEntourageSchema).nullish()
  }),
  health: z.object({
    gir: withEmptyValueOptionalNativeEnum(BeneficiaryGir),
    doctor: z.string().nullish(),
    healthAdditionalInformation: z.string().nullish(),
    socialSecurityNumber: z
      .string()
      .regex(
        /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
        'Veuillez entrer un numéro de sécurité sociale valide'
      )
      .nullish(),
    insurance: z.string().nullish()
  }),
  occupation: z.object({
    socioProfessionalCategory: withEmptyValueOptionalNativeEnum(
      BeneficiarySocioProfessionalCategory
    ),
    occupation: z.string().nullish(),
    employer: z.string().nullish(),
    employerSiret: z.string().nullish(),
    mainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
    mainIncomeAmount: z.coerce.number().nullish(),
    partnerMainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
    partnerMainIncomeAmount: z.coerce.number().nullish(),
    majorChildrenMainIncomeSource: z.array(
      z.nativeEnum(IncomeSource, errorMessages)
    ),
    majorChildrenMainIncomeAmount: z.coerce.number().nullish(),
    unemploymentNumber: z.string().nullish(),
    pensionOrganisations: z.array(
      z.nativeEnum(BeneficiaryPensionOrganisation, errorMessages)
    ),
    otherPensionOrganisations: z.string().nullish(),
    cafNumber: z.string().nullish(),
    bank: z.string().nullish(),
    funeralContract: z.string().nullish(),
    ministereCategorie: withEmptyValueOptionalNativeEnum(
      BeneficiaryMinistereCategorie
    ),
    ministereDepartementServiceAc: withEmptyValueOptionalNativeEnum(
      BeneficiaryMinistereDepartementServiceAc
    ),
    ministereStructure: withEmptyValueOptionalNativeEnum(
      BeneficiaryMinistereStructure
    )
  }),
  external: z.object({
    protectionMeasure: withEmptyValueOptionalNativeEnum(
      BeneficiaryProtectionMeasure
    ),
    representative: z.string().nullish(),
    prescribingStructure: z.string().nullish(),
    orientationType: withEmptyValueOptionalNativeEnum(
      BeneficiaryOrientationType
    ),
    orientationStructure: z.string().nullish(),
    serviceProviders: z.string().nullish(),
    involvedPartners: z.string().nullish()
  }),
  additionalInformation: z.string().nullish()
})

export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>

export const getBeneficiariesSchema = z
  .object({
    orderBy: z.array(
      z.object({
        firstName: z.nativeEnum(Prisma.SortOrder).optional(),
        usualName: z.nativeEnum(Prisma.SortOrder).optional()
      })
    ),
    filters: beneficiaryFilterSchema
  })
  .merge(paginatedSchema)

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
