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
import {
  requiredNativeEnum,
  stringOrEmpty,
  withEmptyValueOptionalNativeEnum,
  emailOrEmpty,
  socialSecurityNumberConstraint,
  unemploymentNumberConstraint,
  cafNumberConstraint,
  stringConstraint,
  phoneConstraint,
  siretConstraint,
  numeroPegaseContraint,
  amountNumber,
  dateOrEmpty,
  openText
} from '../helpers.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import {
  errorMessages,
  validZipcode,
  maxStringLengthMessage,
  validIntNumber,
  requiredErrorMessage
} from '~/utils/zod'

export const updateBeneficiaryGeneralInformationSchema = z.object({
  id: z.string().uuid(),
  structureId: z.string().uuid(),
  referents: z
    .array(z.string().uuid(), {
      required_error: requiredErrorMessage
    })
    .min(1, requiredErrorMessage),
  aidantConnectAuthorized: z.boolean().default(false),
  vulnerablePerson: z.boolean().default(false),
  status: requiredNativeEnum(BeneficiaryStatus),
  title: withEmptyValueOptionalNativeEnum(BeneficiaryTitle),
  firstName: beneficiaryFirstNameOrEmptySchema,
  usualName: stringOrEmpty(beneficiaryLastNameSchema),
  birthName: stringOrEmpty(beneficiaryLastNameSchema),
  birthDate: dateOrEmpty,
  birthPlace: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
  deathDate: dateOrEmpty,
  gender: withEmptyValueOptionalNativeEnum(Gender),
  nationality: withEmptyValueOptionalNativeEnum(Nationality),
  numeroPegase: stringOrEmpty(numeroPegaseContraint),
  accommodationMode: withEmptyValueOptionalNativeEnum(
    BeneficiaryAccommodationMode
  ),
  accommodationName: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .nullish(),
  accommodationAdditionalInformation: openText(200).nullish(),
  zipcode: stringOrEmpty(z.string().min(5, validZipcode)),
  city: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  region: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  department: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  accommodationZone: withEmptyValueOptionalNativeEnum(
    BeneficiaryAccommodationZone
  ),
  street: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  addressComplement: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .nullish(),
  noPhone: z.boolean().default(false),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  mobility: withEmptyValueOptionalNativeEnum(BeneficiaryMobility),
  additionalInformation: openText(1500).nullish()
})

export type UpdateBeneficiaryGeneralInformationInput = z.infer<
  typeof updateBeneficiaryGeneralInformationSchema
>

export const updateBeneficiaryTaxHouseholdSchema = z.object({
  id: z.string().uuid(),
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

export type UpdateBeneficiaryTaxHouseholdInput = z.infer<
  typeof updateBeneficiaryTaxHouseholdSchema
>

export const updateBeneficiaryEntourageSchema = z.object({
  id: z.string().uuid(),
  entourages: z.array(createOrUpdateEntourageSchema).nullish()
})

export type UpdateBeneficiaryEntourageInput = z.infer<
  typeof updateBeneficiaryEntourageSchema
>

export const updateBeneficiaryHealthSchema = z.object({
  id: z.string().uuid(),
  gir: withEmptyValueOptionalNativeEnum(BeneficiaryGir),
  doctor: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  healthAdditionalInformation: openText(200).nullish(),
  socialSecurityNumber: stringOrEmpty(socialSecurityNumberConstraint),
  insurance: stringConstraint.max(100, maxStringLengthMessage(100)).nullish()
})

export type UpdateBeneficiaryHealthInput = z.infer<
  typeof updateBeneficiaryHealthSchema
>

export const updateBeneficiaryOccupationSchema = z.object({
  id: z.string().uuid(),
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
  otherMembersMainIncomeSource: z.array(
    z.nativeEnum(IncomeSource, errorMessages)
  ),
  otherMembersMainIncomeAmount: amountNumber.nullish(),
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

export type UpdateBeneficiaryOccupationInput = z.infer<
  typeof updateBeneficiaryOccupationSchema
>

export const updateBeneficiaryExternalOrganisationsSchema = z.object({
  id: z.string().uuid(),
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

export type UpdateBeneficiaryExternalOrganisationsInput = z.infer<
  typeof updateBeneficiaryExternalOrganisationsSchema
>
