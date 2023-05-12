import { z } from 'zod'
import { multiSelectValueToArray } from '~/utils/zod'

const statFilterSchema = z.object({
  fromDate: z.date().nullish(),
  toDate: z.date().nullish(),
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

export { statFilterSchema }

export type { StatFilterRawInput, StatFilterInput }
