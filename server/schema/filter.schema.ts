import { z } from 'zod'
import dayjs from 'dayjs'
import {
  BeneficiaryStatus,
  FollowupStatus,
  HelpRequestStatus,
  FollowupMedium
} from '@prisma/client'
import { AgeGroup } from '~/client/options/ageGroup'

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
  cities: z.array(z.string()).nullish(),
  referent: z.string().nullish()
})

type StatFilterInput = z.infer<typeof statFilterSchema>

const beneficiaryFilterSchema = z.object({
  followupTypes: z.array(z.string().uuid()).nullish(),
  cities: z.array(z.string()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  status: z.nativeEnum(BeneficiaryStatus).nullish(),
  ageGroup: z.nativeEnum(AgeGroup).nullish()
})

type BeneficiaryFilterInput = z.infer<typeof beneficiaryFilterSchema>

const followupFilterSchema = z.object({
  status: z.nativeEnum(FollowupStatus).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish()
})

type FollowupFilterInput = z.infer<typeof followupFilterSchema>

const helpRequestHistoryFilterSchema = z.object({
  status: z.nativeEnum(HelpRequestStatus).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish()
  // TODO: examinationDate, handlingDate, externalStructure
})

type HelpRequestHistoryFilterInput = z.infer<
  typeof helpRequestHistoryFilterSchema
>

const beneficiaryHistoryFilterSchema = z.object({
  status: z.nativeEnum({ ...FollowupStatus, ...HelpRequestStatus }).nullish(),
  medium: z.array(z.nativeEnum(FollowupMedium)).nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  referents: z.array(z.string().uuid()).nullish(),
  typeSuivi: z.string().nullish()
  // TODO: examinationDate, handlingDate, externalStructure
})

type BeneficiaryHistoryFilterInput = z.infer<
  typeof beneficiaryHistoryFilterSchema
>

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  helpRequestHistoryFilterSchema,
  beneficiaryHistoryFilterSchema
}

export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestHistoryFilterInput,
  BeneficiaryHistoryFilterInput
}
