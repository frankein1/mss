import { z } from 'zod'
import dayjs from 'dayjs'
import {
  BeneficiaryStatus,
  FollowupStatus,
  HelpRequestStatus,
  FollowupMedium,
  Minister,
  UserRole,
  DocumentType,
  EmailStatus
} from '@prisma/client'
import { kindOfBooleanSchema, stringConstraint } from './helpers.schema'
import { AgeGroup } from '~/client/options/ageGroup'
import { maxStringLengthMessage } from '~/utils/zod'
import { TypeSuivi } from '~/types/history'

const statFilterSchema = z.object({
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
  followupTypes: z.array(z.string().uuid()).nullish(),
  cities: z
    .array(stringConstraint.max(50, maxStringLengthMessage(50)))
    .nullish(),
  referent: stringConstraint.max(100, maxStringLengthMessage(100)).nullish()
})

type StatFilterInput = z.infer<typeof statFilterSchema>

const beneficiaryFilterSchema = z.object({
  search: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
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
  status: z.nativeEnum(FollowupStatus).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  ministre: z.array(z.nativeEnum(Minister)).nullish()
})

type FollowupFilterInput = z.infer<typeof followupFilterSchema>

const helpRequestFilterSchema = z.object({
  status: z.nativeEnum(HelpRequestStatus).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema().nullish(),
  externalStructure: kindOfBooleanSchema().nullish(),
  ministre: z.array(z.nativeEnum(Minister)).nullish()
})

type HelpRequestFilterInput = z.infer<typeof helpRequestFilterSchema>

const beneficiaryHistoryFilterSchema = z.object({
  status: z.nativeEnum({ ...FollowupStatus, ...HelpRequestStatus }).nullish(),
  typeSuivi: z.nativeEnum(TypeSuivi).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  examinationDate: z.coerce.date().nullish(),
  handlingDate: kindOfBooleanSchema().nullish(),
  externalStructure: kindOfBooleanSchema().nullish(),
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
  helpRequestFilterSchema,
  beneficiaryHistoryFilterSchema,
  userAdminFilterSchema,
  beneficiaryDocumentFilterSchema,
  emailAdminFilterSchema
}

export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput,
  BeneficiaryHistoryFilterInput,
  UserAdminFilterInput,
  BeneficiaryDocumentFilterInput,
  EmailAdminFilterInput
}
