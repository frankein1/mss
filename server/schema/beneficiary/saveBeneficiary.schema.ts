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
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
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
  stringConstraint,
  phoneConstraint,
  siretConstraint,
  numeroPegaseContraint,
  maxStringLengthMessage,
  amountNumber,
  validIntNumber
} from '~/utils/zod'

export const saveBeneficiaryGeneralInformationSchema = z.object({
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  status: requiredNativeEnum(BeneficiaryStatus),
  title: withEmptyValueOptionalNativeEnum(BeneficiaryTitle),
  firstName: beneficiaryFirstNameOrEmptySchema,
  usualName: stringOrEmpty(beneficiaryLastNameSchema),
  birthName: stringOrEmpty(beneficiaryLastNameSchema),
  birthDate: z.coerce.date(errorMessages).nullish(),
  birthPlace: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
  deathDate: z.coerce.date(errorMessages).nullish(),
  gender: withEmptyValueOptionalNativeEnum(Gender),
  nationality: withEmptyValueOptionalNativeEnum(Nationality),
  numeroPegase: numeroPegaseContraint.nullish(),
  accommodationMode: withEmptyValueOptionalNativeEnum(
    BeneficiaryAccommodationMode
  ),
  accommodationName: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .nullish(),
  accommodationAdditionalInformation: stringConstraint
    .max(200, maxStringLengthMessage(200))
    .nullish(),
  zipcode: stringOrEmpty(z.string().min(5, validZipcode)),
  city: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  region: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  accommodationZone: withEmptyValueOptionalNativeEnum(
    BeneficiaryAccommodationZone
  ),
  street: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  addressComplement: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  postOfficeBox: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  noPhone: z.boolean().default(false),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  mobility: withEmptyValueOptionalNativeEnum(BeneficiaryMobility),
  additionalInformation: stringConstraint
    .max(1500, maxStringLengthMessage(1500))
    .nullish()
})

export type SaveBeneficiaryGeneralInformationInput = z.infer<
  typeof saveBeneficiaryGeneralInformationSchema
>

export const saveBeneficiaryTaxHouseholdSchema = z.object({
  familySituation: withEmptyValueOptionalNativeEnum(BeneficiaryFamilySituation),
  minorChildren: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .nullish(),
  majorChildren: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .nullish(),
  caregiver: z.boolean().default(false),
  taxHouseholds: z.array(createOrUpdateTaxHouseholdSchema).nullish()
})

export type SaveBeneficiaryTaxHouseholdInput = z.infer<
  typeof saveBeneficiaryTaxHouseholdSchema
>

export const saveBeneficiaryEntourageSchema = z.object({
  entourages: z.array(createOrUpdateEntourageSchema).nullish()
})

export type SaveBeneficiaryEntourageInput = z.infer<
  typeof saveBeneficiaryEntourageSchema
>

export const saveBeneficiaryHealthSchema = z.object({
  gir: withEmptyValueOptionalNativeEnum(BeneficiaryGir),
  doctor: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  healthAdditionalInformation: stringConstraint
    .max(200, maxStringLengthMessage(200))
    .nullish(),
  socialSecurityNumber: stringOrEmpty(socialSecurityNumberConstraint),
  insurance: stringConstraint.max(100, maxStringLengthMessage(100)).nullish()
})

export type SaveBeneficiaryHealthInput = z.infer<
  typeof saveBeneficiaryHealthSchema
>

export const saveBeneficiaryOccupationSchema = z.object({
  socioProfessionalCategory: withEmptyValueOptionalNativeEnum(
    BeneficiarySocioProfessionalCategory
  ),
  occupation: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  employer: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  employerSiret: stringOrEmpty(siretConstraint),
  mainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
  mainIncomeAmount: amountNumber.nullish(),
  partnerMainIncomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
  partnerMainIncomeAmount: amountNumber.nullish(),
  majorChildrenMainIncomeSource: z.array(
    z.nativeEnum(IncomeSource, errorMessages)
  ),
  majorChildrenMainIncomeAmount: amountNumber.nullish(),
  unemploymentNumber: unemploymentNumberConstraint.nullish(),
  pensionOrganisations: z.array(
    z.nativeEnum(BeneficiaryPensionOrganisation, errorMessages)
  ),
  otherPensionOrganisations: stringConstraint
    .max(200, maxStringLengthMessage(200))
    .nullish(),
  cafNumber: cafNumberConstraint.nullish(),
  bank: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  funeralContract: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .nullish(),
  ministereCategorie: withEmptyValueOptionalNativeEnum(
    BeneficiaryMinistereCategorie
  ),
  ministereDepartementServiceAc: withEmptyValueOptionalNativeEnum(
    BeneficiaryMinistereDepartementServiceAc
  ),
  ministereStructure: withEmptyValueOptionalNativeEnum(
    BeneficiaryMinistereStructure
  )
})

export type SaveBeneficiaryOccupationInput = z.infer<
  typeof saveBeneficiaryOccupationSchema
>

export const saveBeneficiaryExternalOrganisationsSchema = z.object({
  protectionMeasure: withEmptyValueOptionalNativeEnum(
    BeneficiaryProtectionMeasure
  ),
  representative: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  prescribingStructure: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  orientationType: withEmptyValueOptionalNativeEnum(BeneficiaryOrientationType),
  orientationStructure: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  serviceProviders: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  involvedPartners: stringConstraint
    .max(200, maxStringLengthMessage(200))
    .nullish()
})

export type SaveBeneficiaryExternalOrganisationsInput = z.infer<
  typeof saveBeneficiaryExternalOrganisationsSchema
>
