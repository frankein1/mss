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
    usualName: beneficiaryLastNameSchema,
    birthName: beneficiaryLastNameSchema,
    birthDate: z.coerce.date(errorMessages).nullish(),
    birthPlace: z.string().nullish(),
    deathDate: z.coerce.date(errorMessages).nullish(),
    gender: withEmptyValueOptionalNativeEnum(Gender),
    nationality: withEmptyValueOptionalNativeEnum(Nationality),
    numeroPegase: z.string().nullish(),
    accommodationMode: withEmptyValueOptionalNativeEnum(
      BeneficiaryAccommodationMode
    ),
    accommodationName: z.string().nullish(),
    accommodationAdditionalInformation: z.string().nullish(),
    zipcode: stringOrEmpty(z.string().min(5, validZipcode)),
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

export type SaveBeneficiaryInput = z.infer<typeof saveBeneficiarySchema>
