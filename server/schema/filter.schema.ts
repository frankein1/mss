import { z } from 'zod'
import { BeneficiaryStatus } from '@prisma/client'
import dayjs from 'dayjs'
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

export { statFilterSchema, beneficiaryFilterSchema }

export type { StatFilterInput, BeneficiaryFilterInput }
