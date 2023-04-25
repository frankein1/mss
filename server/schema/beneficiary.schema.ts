import {
  BeneficiaryAccomodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
  IncomeSource
} from '@prisma/client'
import { z } from 'zod'
import { PensionOrganisations } from '~/client/options/beneficiary'
import { Nationalities } from '~/client/options/nationality'
import { errorMessages, zodEnumFromObjectKeys } from '~/utils/zod'

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

export const createBeneficiaryWithGeneralInfoSchema = z.object({
  // General information
  structureId: z.string().uuid(),
  referents: z
    .array(z.string().uuid(), {
      ...errorMessages,
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  status: z.nativeEnum(BeneficiaryStatus, errorMessages),
  title: z.nativeEnum(BeneficiaryTitle).nullish(),
  firstName: z.string().nullish(),
  usualName: z.string().nullish(),
  birthName: z.string().nullish(),
  birthDate: z.date(errorMessages).nullish(),
  birthPlace: z.string().nullish(),
  deathDate: z.date(errorMessages).nullish(),
  gender: z.nativeEnum(Gender).nullish(),
  // nationality: z.enum(zodEnumFromObjectKeys(Nationalities)).nullish(),
  nationality: z.enum(zodEnumFromObjectKeys(Nationalities)).nullish(),
  accomodationMode: z.nativeEnum(BeneficiaryAccomodationMode).nullish(),
  accomodationName: z.string().nullish(),
  accomodationAdditionalInformation: z.string().nullish(),
  street: z.string().nullish(),
  streetNumber: z.string().nullish(),
  addressComplement: z.string().nullish(),
  zipcode: z.string().nullish(),
  city: z.string().nullish(),
  region: z.string().nullish(),
  noPhone: z.boolean().default(false),
  phone1: z.string().nullish(),
  phone2: z.string().nullish(),
  email: z.string().email().nullish(),
  familySituation: z.nativeEnum(BeneficiaryFamilySituation).nullish(),
  caregiver: z.boolean().default(false),
  minorChildren: z.number().int().gte(0).nullish(),
  majorChildren: z.number().int().gte(0).nullish(),
  mobility: z.nativeEnum(BeneficiaryMobility).nullish(),
  administration: z.string().nullish(),
  minister: z.string().nullish(),

  // Additional info
  additionalInformation: z.string().nullish()
})

export const createBeneficiaryWithFullDataSchema =
  createBeneficiaryWithGeneralInfoSchema.extend({
    // Health
    gir: z.nativeEnum(BeneficiaryGir).nullish(),
    doctor: z.string().nullish(),
    healthAdditionalInformation: z.string().nullish(),
    socialSecurityNumber: z.string().nullish(),
    insurance: z.string().nullish(),

    // Occupation
    socioProfessionalCategory: z
      .nativeEnum(BeneficiarySocioProfessionalCategory)
      .nullish(),
    occupation: z.string().nullish(),
    employer: z.string().nullish(),
    employerSiret: z.string().nullish(),
    mainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    mainIncomeAmount: z.number().nullish(),
    partnerMainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    partnerMainIncomeAmount: z.number().nullish(),
    majorChildrenMainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    majorChildrenMainIncomeAmount: z.number().nullish(),
    unemploymentNumber: z.string().nullish(),
    pensionOrganisations: z
      .array(z.enum(PensionOrganisations, errorMessages))
      .optional(),
    cafNumber: z.string().nullish(),
    bank: z.string().nullish(),
    funeralContract: z.string().nullish(),

    // External Structures
    protectionMeasure: z.nativeEnum(BeneficiaryProtectionMeasure).nullish(),
    representative: z.string().nullish(),
    prescribingStructure: z.string().nullish(),
    orientationType: z.nativeEnum(BeneficiaryOrientationType).nullish(),
    orientationStructure: z.string().nullish(),
    serviceProviders: z.string().nullish(),
    involvedPartners: z.string().nullish()
  })

export const editBeneficiaryFullDataSchema = createBeneficiaryWithFullDataSchema
  .extend({
    beneficiaryId: z.string().uuid()
  })
  .omit({ structureId: true })

export const editBeneficiaryGeneralInfoSchema =
  createBeneficiaryWithGeneralInfoSchema
    .extend({
      beneficiaryId: z.string().uuid()
    })
    .omit({ structureId: true })
