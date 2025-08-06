import { z } from 'zod/v4'
import dayjs from 'dayjs'
import {
  BeneficiaryStatus,
  SocialSupportStatus,
  FollowupMedium,
  Minister,
  UserRole,
  DocumentType,
  EmailStatus,
  FileInstructionType,
  JobStatus,
  BeneficiaryMinistereDepartementServiceAc,
  BeneficiaryMinistereStructure
} from '@prisma/client'
import {
  kindOfBooleanSchema,
  stringConstraint,
  withEmptyValueOptionalNativeEnum
} from './helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'
import { TypeSuivi, AgeGroup } from '~/client/options'
import { StatPeriodFilter } from '~/types/stat'
import { FollowupPeriodFilter } from '~/types/followup'
import {
  FilterBeneficiaryNotFilled,
  FilterFollowupNotFilled
} from '~/utils/constants/filters'

const statFilterSchema = z.object({
  helpRequestSubject: withEmptyValueOptionalNativeEnum(FileInstructionType),
  period: withEmptyValueOptionalNativeEnum(StatPeriodFilter),
  fromDate: z.coerce.date().nullish(),
  toDate: z.coerce
    .date()
    .nullish()
    .transform(v => {
      if (v === undefined || v === null) {
        return v
      }
      return dayjs(v).hour(23).minute(59).second(59).toDate()
    }),
  socialSupportSubjects: z.array(z.uuid()).nullish(),
  cities: z
    .array(stringConstraint.max(50, maxStringLengthMessage(50)))
    .nullish(),
  referent: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  ministre: z.array(z.enum(Minister)).nullish(),
  ministereDepartementServiceAc: z
    .enum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.enum(BeneficiaryMinistereStructure).nullish(),
  createdById: z.array(z.uuid()).nullish(),
  beneficiaryStatus: z.enum(BeneficiaryStatus).nullish(),
  ageGroup: z.enum(AgeGroup).nullish()
})

type StatFilterInput = Omit<
  z.infer<typeof statFilterSchema>,
  'helpRequestSubject'
> & {
  helpRequestSubject?:
    | z.infer<typeof statFilterSchema>['helpRequestSubject']
    | ''
}

const beneficiaryFilterSchema = z.object({
  search: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  socialSupportSubjects: z.array(z.uuid()).nullish(),
  referents: z.array(z.uuid()).nullish(),
  status: z.enum(BeneficiaryStatus).nullish(),
  ageGroup: z.array(z.enum(AgeGroup)).nullish(),
  ministereDepartementServiceAc: z
    .enum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.enum(BeneficiaryMinistereStructure).nullish(),
  vulnerablePerson: z
    .string()
    .nullish()
    .transform(val => (val ? val === 'true' : undefined)),
  qpv: z
    .string()
    .nullish()
    .transform(val => (val ? val === 'true' : undefined)),
  notFilled: z.enum(FilterBeneficiaryNotFilled).nullish()
})

type BeneficiaryFilterInput = z.input<typeof beneficiaryFilterSchema>
type BeneficiaryFilterServerInput = z.output<typeof beneficiaryFilterSchema>

const beneficiaryDocumentFilterSchema = z.object({
  type: z.enum(DocumentType).nullish(),
  tags: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  beneficiaryId: z.uuid().nullish()
})

type BeneficiaryDocumentFilterInput = z.infer<
  typeof beneficiaryDocumentFilterSchema
>

const followupFilterSchema = z.object({
  status: z.enum(SocialSupportStatus).nullish(),
  medium: z.array(z.enum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.uuid()).nullish(),
  createdById: z.array(z.uuid()).nullish(),
  period: withEmptyValueOptionalNativeEnum(FollowupPeriodFilter),
  fromDate: z.coerce.date().nullish(),
  toDate: z.coerce
    .date()
    .nullish()
    .transform(v => {
      if (v === undefined || v === null) {
        return v
      }
      return dayjs(v).hour(23).minute(59).second(59).toDate()
    }),
  ministre: z.array(z.enum(Minister)).nullish(),
  ministereDepartementServiceAc: z
    .enum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.enum(BeneficiaryMinistereStructure).nullish(),
  notFilled: z.enum(FilterFollowupNotFilled).nullish()
})

type FollowupFilterInput = z.infer<typeof followupFilterSchema>

const familyFileHistoryFilterSchema = z.object({
  status: z.enum(SocialSupportStatus).nullish(),
  typeSuivi: z.enum(TypeSuivi).nullish(),
  medium: z.array(z.enum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema(),
  externalStructure: kindOfBooleanSchema(),
  referents: z.array(z.uuid()).nullish(),
  beneficiaryId: z.uuid().nullish() // exemple
})

type FamilyFileHistoryFilterInput = z.infer<
  typeof familyFileHistoryFilterSchema
>

const userAdminFilterSchema = z.object({
  role: z.enum(UserRole).nullish()
})

type UserAdminFilterInput = z.infer<typeof userAdminFilterSchema>

const emailAdminFilterSchema = z.object({
  status: z.enum(EmailStatus).nullish()
})

type EmailAdminFilterInput = z.infer<typeof emailAdminFilterSchema>

const jobResultAdminFilterSchema = z.object({
  status: z.enum(JobStatus).nullish()
})

type JobResultAdminFilterInput = z.infer<typeof jobResultAdminFilterSchema>

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  familyFileHistoryFilterSchema,
  userAdminFilterSchema,
  beneficiaryDocumentFilterSchema,
  emailAdminFilterSchema,
  jobResultAdminFilterSchema
}

export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  BeneficiaryFilterServerInput,
  FollowupFilterInput,
  FamilyFileHistoryFilterInput,
  UserAdminFilterInput,
  BeneficiaryDocumentFilterInput,
  EmailAdminFilterInput,
  JobResultAdminFilterInput
}
