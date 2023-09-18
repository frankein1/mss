import {
  BeneficiaryAccommodationMode,
  BeneficiaryAccommodationZone,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMinistereCategorie,
  BeneficiaryMinistereDepartementServiceAc,
  BeneficiaryMinistereStructure,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryPensionOrganisation,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
  IncomeSource,
  Nationality
} from '@prisma/client'
import { z } from 'zod'
import {
  createOrUpdateEntourageSchema,
  createOrUpdateTaxHouseholdSchema
} from '../relative.schema'
import { beneficiaryFirstNameSchema } from './beneficiaryFirstName.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import {
  errorMessages,
  requiredNativeEnum,
  stringOrEmpty,
  withEmptyValueOptionalNativeEnum,
  validZipcode,
  emailOrEmpty,
  socialSecurityNumberConstraint,
  unemploymentNumberConstraint,
  cafNumberConstraint,
  wordConstraint,
  phoneConstraint,
  siretConstraint,
  numeroPegaseContraint
} from '~/utils/zod'

export const saveBeneficiarySchema = z.object({
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
    usualName: beneficiaryLastNameSchema.nullish(),
    birthName: beneficiaryLastNameSchema,
    birthDate: z.coerce.date(errorMessages).nullish(),
    birthPlace: wordConstraint().nullish(),
    deathDate: z.coerce.date(errorMessages).nullish(),
    gender: withEmptyValueOptionalNativeEnum(Gender),
    nationality: withEmptyValueOptionalNativeEnum(Nationality),
    numeroPegase: numeroPegaseContraint.nullish(),
    accommodationMode: withEmptyValueOptionalNativeEnum(
      BeneficiaryAccommodationMode
    ),
    accommodationName: wordConstraint().nullish(),
    accommodationAdditionalInformation: wordConstraint(200).nullish(),
    zipcode: stringOrEmpty(z.string().min(5, validZipcode)),
    city: wordConstraint().nullish(),
    region: wordConstraint().nullish(),
    accommodationZone: withEmptyValueOptionalNativeEnum(
      BeneficiaryAccommodationZone
    ),
    streetNumber: wordConstraint(10).nullish(),
    street: wordConstraint().nullish(),
    addressComplement: wordConstraint(200).nullish(),
    noPhone: z.boolean().default(false),
    phone1: phoneConstraint.nullish(),
    phone2: phoneConstraint.nullish(),
    email: emailOrEmpty(),
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
    doctor: wordConstraint().nullish(),
    healthAdditionalInformation: wordConstraint(200).nullish(),
    socialSecurityNumber: socialSecurityNumberConstraint.nullish(),
    insurance: wordConstraint().nullish()
  }),
  occupation: z.object({
    socioProfessionalCategory: withEmptyValueOptionalNativeEnum(
      BeneficiarySocioProfessionalCategory
    ),
    occupation: wordConstraint().nullish(),
    employer: wordConstraint().nullish(),
    employerSiret: siretConstraint.nullish(),
    mainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
    mainIncomeAmount: z.coerce.number().nullish(),
    partnerMainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
    partnerMainIncomeAmount: z.coerce.number().nullish(),
    majorChildrenMainIncomeSource: z.array(
      z.nativeEnum(IncomeSource, errorMessages)
    ),
    majorChildrenMainIncomeAmount: z.coerce.number().nullish(),
    unemploymentNumber: unemploymentNumberConstraint.nullish(),
    pensionOrganisations: z.array(
      z.nativeEnum(BeneficiaryPensionOrganisation, errorMessages)
    ),
    otherPensionOrganisations: wordConstraint().nullish(),
    cafNumber: cafNumberConstraint.nullish(),
    bank: wordConstraint().nullish(),
    funeralContract: wordConstraint().nullish(),
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
    representative: wordConstraint().nullish(),
    prescribingStructure: wordConstraint().nullish(),
    orientationType: withEmptyValueOptionalNativeEnum(
      BeneficiaryOrientationType
    ),
    orientationStructure: wordConstraint().nullish(),
    serviceProviders: wordConstraint().nullish(),
    involvedPartners: wordConstraint().nullish()
  }),
  additionalInformation: wordConstraint(200).nullish()
})

export type SaveBeneficiaryInput = z.infer<typeof saveBeneficiarySchema>
