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
  FileInstructionType
} from '@prisma/client'
import {
  kindOfBooleanSchema,
  stringConstraint,
  withEmptyValueOptionalNativeEnum
} from './helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'
import { TypeSuivi, AgeGroup } from '~/client/options'
import { StatPeriodFilter } from '~/types/stat'

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
  beneficiaryStatus: z.nativeEnum(BeneficiaryStatus).nullish()
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
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  status: z.nativeEnum(BeneficiaryStatus).nullish(),
  ageGroup: z.nativeEnum(AgeGroup).nullish()
})

type BeneficiaryFilterInput = z.infer<typeof beneficiaryFilterSchema>

const beneficiaryDocumentFilterSchema = z.object({
  type: z.nativeEnum(DocumentType).nullish(),
  tags: stringConstraint.max(100, maxStringLengthMessage(100)).nullish()
})

type BeneficiaryDocumentFilterInput = z.infer<
  typeof beneficiaryDocumentFilterSchema
>

const followupFilterSchema = z.object({
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  ministre: z.array(z.nativeEnum(Minister)).nullish()
})

type FollowupFilterInput = z.infer<typeof followupFilterSchema>

const beneficiaryHistoryFilterSchema = z.object({
  status: z.nativeEnum(SocialSupportStatus).nullish(),
  typeSuivi: z.nativeEnum(TypeSuivi).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  socialSupportSubjects: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema(),
  externalStructure: kindOfBooleanSchema(),
  referents: z.array(z.string().uuid()).nullish()
})

type BeneficiaryHistoryFilterInput = z.infer<
  typeof beneficiaryHistoryFilterSchema
>

const userAdminFilterSchema = z.object({
  role: z.nativeEnum(UserRole).nullish()
})

type UserAdminFilterInput = z.infer<typeof userAdminFilterSchema>

const emailAdminFilterSchema = z.object({
  status: z.nativeEnum(EmailStatus).nullish()
})

type EmailAdminFilterInput = z.infer<typeof emailAdminFilterSchema>

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  beneficiaryHistoryFilterSchema,
  userAdminFilterSchema,
  beneficiaryDocumentFilterSchema,
  emailAdminFilterSchema
}

export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  FollowupFilterInput,
  BeneficiaryHistoryFilterInput,
  UserAdminFilterInput,
  BeneficiaryDocumentFilterInput,
  EmailAdminFilterInput
}
