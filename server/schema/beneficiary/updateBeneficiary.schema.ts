import {
  BeneficiaryAccommodationMode,
  BeneficiaryAccommodationZone,
  BeneficiaryActivityStatus,
  BeneficiaryContractType,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMinistereCategorie,
  BeneficiaryMinistereDepartementServiceAc,
  BeneficiaryMinistereStructure,
  BeneficiaryMobility,
  BeneficiaryPensionOrganisation,
  BeneficiaryProtectionMeasure,
  BeneficiarySchoolClass,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryStudyLevel,
  BeneficiaryTitle,
  Gender,
  Nationality
} from '@prisma/client'
import { z } from 'zod'
import { createOrUpdateEntourageSchema } from '../relative.schema'
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
  dateOrEmpty,
  openText,
  limitedStringConstraint
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
  birthPlace: stringConstraint.max(40, maxStringLengthMessage(40)).nullish(),
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
  qpv: z.boolean().default(false),
  district: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
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
  weddingDate: dateOrEmpty,
  divorceDate: dateOrEmpty,
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
  caregiver: z.boolean().default(false)
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

/**
 * The `Disability` and `SickLeave` members of BeneficiarySocioProfessionalCategory
 * were migrated to BeneficiaryActivityStatus (Invalidite / ArretMaladie). They are
 * kept in the Postgres enum for historical rows only: no beneficiary still stores
 * them (the data migration nulled them out) and no code path writes or displays
 * them. App code therefore treats this field as the active subset below, even
 * though Prisma and zod still surface the full union.
 */
export type ActiveBeneficiarySocioProfessionalCategory = Exclude<
  BeneficiarySocioProfessionalCategory,
  'Disability' | 'SickLeave'
>

export const updateBeneficiaryOccupationSchema = z.object({
  id: z.string().uuid(),
  // Type-only narrowing (runtime still accepts the full native enum): the input
  // type is the active subset so callers never handle the obsolete members.
  socioProfessionalCategory: withEmptyValueOptionalNativeEnum(
    BeneficiarySocioProfessionalCategory
  ) as unknown as z.ZodType<
    ActiveBeneficiarySocioProfessionalCategory | null | undefined
  >,
  activityStatus: z.array(
    z.nativeEnum(BeneficiaryActivityStatus, errorMessages)
  ),
  contractType: withEmptyValueOptionalNativeEnum(BeneficiaryContractType),
  occupation: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  studyLevel: withEmptyValueOptionalNativeEnum(BeneficiaryStudyLevel),
  schoolClass: withEmptyValueOptionalNativeEnum(BeneficiarySchoolClass),
  schoolUai: z
    .string()
    .nullish()
    .transform(v => v || null),
  employer: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  employerSiret: stringOrEmpty(siretConstraint),
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

const contributingPartnerSchema = z.object({
  id: z.string().uuid().optional(),
  partnerOrganizationId: z.string().uuid(),
  partnerOrganizationContactId: z
    .string()
    .uuid()
    .nullish()
    .transform(v => v || null),
  precisions: limitedStringConstraint(null, 200).nullish()
})

export type ContributingPartnerInput = z.infer<typeof contributingPartnerSchema>

export const updateBeneficiaryExternalOrganisationsSchema = z.object({
  id: z.string().uuid(),
  protectionMeasure: withEmptyValueOptionalNativeEnum(
    BeneficiaryProtectionMeasure
  ),
  representative: limitedStringConstraint(null, 100).nullish(),
  prescribingOrganizationId: z
    .string()
    .uuid()
    .nullish()
    .transform(v => v || null),
  prescribingOrganizationContactId: z
    .string()
    .uuid()
    .nullish()
    .transform(v => v || null),
  contributingPartners: z
    .array(contributingPartnerSchema)
    .max(50, 'Veuillez renseigner au maximum 50 partenaires.')
    .default([])
})

export const updateBeneficiaryArchiveDate = z.object({
  id: z.string().uuid()
})

export type UpdateBeneficiaryExternalOrganisationsInput = z.infer<
  typeof updateBeneficiaryExternalOrganisationsSchema
>
