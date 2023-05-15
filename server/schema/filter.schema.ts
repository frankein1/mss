import { z } from 'zod'
import { BeneficiaryStatus } from '@prisma/client'
import { multiSelectValueToArray } from '~/utils/zod'
import { AgeGroup } from '~/client/options/ageGroup'

const MIDNIGHT_SUFFIX = 'T23:59:59+01:00'

const statFilterSchema = z.object({
  fromDate: z.coerce.date().nullish(),
  toDate: z
    .string()
    .nullish()
    .transform(v =>
      v === undefined || v === null ? v : new Date(`${v}${MIDNIGHT_SUFFIX}`)
    )
    .pipe(z.date().nullish()),
  followupTypes: z
    .string()
    .nullish()
    .transform(multiSelectValueToArray)
    .pipe(z.array(z.string().uuid()).nullish()),
  cities: z
    .string()
    .nullish()
    .transform(multiSelectValueToArray)
    .pipe(z.array(z.string()).nullish()),
  referent: z.string().nullish()
})

type StatFilterRawInput = z.input<typeof statFilterSchema>
type StatFilterInput = z.infer<typeof statFilterSchema>

const beneficiaryFilterSchema = z.object({
  followupTypes: z
    .string()
    .nullish()
    .transform(multiSelectValueToArray)
    .pipe(z.array(z.string().uuid()).nullish()),
  cities: z
    .string()
    .nullish()
    .transform(multiSelectValueToArray)
    .pipe(z.array(z.string()).nullish()),
  referents: z
    .string()
    .nullish()
    .transform(multiSelectValueToArray)
    .pipe(z.array(z.string().uuid()).nullish()),
  status: z.nativeEnum(BeneficiaryStatus).nullish(),
  ageGroup: z.nativeEnum(AgeGroup).nullish()
})

type BeneficiaryFilterRawInput = z.input<typeof beneficiaryFilterSchema>
type BeneficiaryFilterInput = z.infer<typeof beneficiaryFilterSchema>

export { statFilterSchema, beneficiaryFilterSchema }

export type {
  StatFilterRawInput,
  StatFilterInput,
  BeneficiaryFilterRawInput,
  BeneficiaryFilterInput
}
