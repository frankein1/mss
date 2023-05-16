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
  Prisma
} from '@prisma/client'
import { z } from 'zod'
import {
  createOrUpdateEntourageSchema,
  createOrUpdateTaxHouseholdSchema
} from './relative.schema'
import { beneficiaryFilterSchema } from './filter.schema'
import { errorMessages, validZipcode } from '~/utils/zod'

export const idSchema = z.object({
  id: z.string()
})

export const searchBeneficiarySchema = z.object({
  query: z.string()
})

export type SearchBeneficiaryInput = z.infer<typeof searchBeneficiarySchema>

const createBeneficiarySchema = z.object({
  structureId: z.string().uuid(),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  title: z.nativeEnum(BeneficiaryTitle).nullish(),
  firstName: z.string().nullish(),
  usualName: z.string().nullish(),
  birthName: z.string().nullish(),
  birthDate: z.date(errorMessages).nullish(),
  birthPlace: z.string().nullish(),
  deathDate: z.date(errorMessages).nullish(),
  gender: z.nativeEnum(Gender).nullish(),
  street: z.string().nullish(),
  streetNumber: z.string().nullish(),
  addressComplement: z.string().nullish(),
  zipcode: z.string().nullish(),
  city: z.string().nullish(),
  region: z.string().nullish(),
  noPhone: z.boolean().default(false),
  phone1: z.string().nullish(),
  email: z.string().email().nullish()
})

type BeneficiaryCreationInput = z.infer<typeof createBeneficiarySchema>

export { createBeneficiarySchema }

export type { BeneficiaryCreationInput }

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
    status: z.nativeEnum(BeneficiaryStatus, errorMessages),
    title: z.nativeEnum(BeneficiaryTitle).nullable(),
    firstName: z.string(),
    usualName: z.string().nullish(),
    birthName: z.string(),
    birthDate: z.coerce.date(errorMessages).nullish(),
    birthPlace: z.string().nullish(),
    deathDate: z.date(errorMessages).nullish(),
    gender: z.nativeEnum(Gender).nullish(),
    nationality: z.nativeEnum(Nationality).nullish(),
    numeroPegase: z.string().nullish(),
    accommodationMode: z.nativeEnum(BeneficiaryAccommodationMode).nullish(),
    accommodationName: z.string().nullish(),
    accommodationAdditionalInformation: z.string().nullish(),
    zipcode: z.string().min(5, validZipcode).nullish(),
    city: z.string().nullish(),
    region: z.string().nullish(),
    accommodationZone: z.nativeEnum(BeneficiaryAccommodationZone).nullish(),
    streetNumber: z.string().nullish(),
    street: z.string().nullish(),
    addressComplement: z.string().nullish(),
    noPhone: z.boolean().default(false),
    phone1: z.string().nullish(),
    phone2: z.string().nullish(),
    email: z.string().email().nullish(),
    caregiver: z.boolean().default(false),
    mobility: z.nativeEnum(BeneficiaryMobility).nullish()
  }),
  taxHousehold: z.object({
    familySituation: z.nativeEnum(BeneficiaryFamilySituation).nullish(),
    minorChildren: z.coerce.number().gte(0).nullish(),
    majorChildren: z.coerce.number().gte(0).nullish(),
    taxHouseholds: z.array(createOrUpdateTaxHouseholdSchema)
  }),
  entourage: z.object({
    entourages: z.array(createOrUpdateEntourageSchema)
  }),
  health: z.object({
    gir: z.nativeEnum(BeneficiaryGir).nullish(),
    doctor: z.string().nullish(),
    healthAdditionalInformation: z.string().nullish(),
    socialSecurityNumber: z.string().nullish(),
    insurance: z.string().nullish()
  }),
  occupation: z.object({
    socioProfessionalCategory: z
      .nativeEnum(BeneficiarySocioProfessionalCategory)
      .nullish(),
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
    ministereCategorie: z.string().nullish(),
    ministereDepartementServiceAc: z.string().nullish(),
    ministereStructure: z.string().nullish()
  }),
  external: z.object({
    protectionMeasure: z.nativeEnum(BeneficiaryProtectionMeasure).nullish(),
    representative: z.string().nullish(),
    prescribingStructure: z.string().nullish(),
    orientationType: z.nativeEnum(BeneficiaryOrientationType).nullish(),
    orientationStructure: z.string().nullish(),
    serviceProviders: z.string().nullish(),
    involvedPartners: z.string().nullish()
  }),
  additionalInformation: z.string().nullish()
})

export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>

export const getBeneficiariesSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  orderBy: z.array(
    z.object({
      firstName: z.nativeEnum(Prisma.SortOrder).optional(),
      usualName: z.nativeEnum(Prisma.SortOrder).optional()
    })
  ),
  filters: beneficiaryFilterSchema
})

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
