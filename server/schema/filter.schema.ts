import { z } from 'zod'

const statFilterSchema = z.object({
  fromDate: z.date().nullish(),
  toDate: z.date().nullish(),
  followupTypes: z.array(z.string().uuid()).nullish(),
  cities: z.array(z.string()).nullish(),
  referent: z.string().nullish()
})

type StatFilterInput = z.infer<typeof statFilterSchema>

export { statFilterSchema }

export type { StatFilterInput }
