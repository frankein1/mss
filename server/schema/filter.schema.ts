import { z } from 'zod'
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
  FilterFollowupNotFilled,
  FilterWorkshopTimeDirection
} from '~/utils/constants/filters'
import { WorkshopPeriodFilter } from '~/types/workshop'

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
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  cities: z
    .array(stringConstraint.max(50, maxStringLengthMessage(50)))
    .nullish(),
  referent: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  ministre: z.array(z.nativeEnum(Minister)).nullish(),
  ministereDepartementServiceAc: z
    .nativeEnum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.nativeEnum(BeneficiaryMinistereStructure).nullish(),
  createdById: z.array(z.string().uuid()).nullish(),
  beneficiaryStatus: z.nativeEnum(BeneficiaryStatus).nullish(),
  ageGroup: z.nativeEnum(AgeGroup).nullish()
})

const workshopStatFilterSchema = z.object({
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
  workshopNameIds: z.array(z.string().uuid()).optional(),
  partnerOrganizationIds: z.array(z.string().uuid()).optional(),
  referent: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  createdById: z.array(z.string().uuid()).nullish(),
  ageGroup: z.nativeEnum(AgeGroup).nullish()
})

type WorkshopStatFilterInput = z.infer<typeof workshopStatFilterSchema>

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
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  status: z.nativeEnum(BeneficiaryStatus).nullish(),
  ageGroup: z.array(z.nativeEnum(AgeGroup)).nullish(),
  ministereDepartementServiceAc: z
    .nativeEnum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.nativeEnum(BeneficiaryMinistereStructure).nullish(),
  vulnerablePerson: z
    .string()
    .nullish()
    .transform(val => (val ? val === 'true' : undefined)),
  qpv: z
    .string()
    .nullish()
    .transform(val => (val ? val === 'true' : undefined)),
  notFilled: z.nativeEnum(FilterBeneficiaryNotFilled).nullish()
})

type BeneficiaryFilterInput = z.input<typeof beneficiaryFilterSchema>
type BeneficiaryFilterServerInput = z.output<typeof beneficiaryFilterSchema>

const beneficiaryDocumentFilterSchema = z.object({
  type: z.nativeEnum(DocumentType).nullish(),
  tags: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  beneficiaryId: z.string().uuid().nullish()
})

type BeneficiaryDocumentFilterInput = z.infer<
  typeof beneficiaryDocumentFilterSchema
>

const followupFilterSchema = z.object({
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  createdById: z.array(z.string().uuid()).nullish(),
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
  ministre: z.array(z.nativeEnum(Minister)).nullish(),
  ministereDepartementServiceAc: z
    .nativeEnum(BeneficiaryMinistereDepartementServiceAc)
    .nullish(),
  ministereStructure: z.nativeEnum(BeneficiaryMinistereStructure).nullish(),
  notFilled: z.nativeEnum(FilterFollowupNotFilled).nullish()
})

type FollowupFilterInput = z.infer<typeof followupFilterSchema>

const familyFileHistoryFilterSchema = z.object({
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  typeSuivi: z.nativeEnum(TypeSuivi).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema(),
  externalStructure: kindOfBooleanSchema(),
  referents: z.array(z.string().uuid()).nullish(),
  beneficiaryId: z.string().uuid().nullish() // exemple
})

type FamilyFileHistoryFilterInput = z.infer<
  typeof familyFileHistoryFilterSchema
>

const userAdminFilterSchema = z.object({
  role: z.nativeEnum(UserRole).nullish()
})

type UserAdminFilterInput = z.infer<typeof userAdminFilterSchema>

const emailAdminFilterSchema = z.object({
  status: z.nativeEnum(EmailStatus).nullish()
})

type EmailAdminFilterInput = z.infer<typeof emailAdminFilterSchema>

const jobResultAdminFilterSchema = z.object({
  status: z.nativeEnum(JobStatus).nullish()
})

type JobResultAdminFilterInput = z.infer<typeof jobResultAdminFilterSchema>

const workshopFilterSchema = z.object({
  timeDirection: z.nativeEnum(FilterWorkshopTimeDirection).optional(),
  workshopNameIds: z.array(z.string().uuid()).optional(),
  period: withEmptyValueOptionalNativeEnum(WorkshopPeriodFilter),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional()
})

type WorkshopFilterInput = z.infer<typeof workshopFilterSchema>

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  familyFileHistoryFilterSchema,
  userAdminFilterSchema,
  beneficiaryDocumentFilterSchema,
  emailAdminFilterSchema,
  jobResultAdminFilterSchema,
  workshopFilterSchema,
  workshopStatFilterSchema
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
  JobResultAdminFilterInput,
  WorkshopFilterInput,
  WorkshopStatFilterInput
}
