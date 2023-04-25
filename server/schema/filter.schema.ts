import { z } from 'zod'

const statFilterSchema = z.object({
  fromDate: z.string().nullish()
})

type StatFilterInput = z.infer<typeof statFilterSchema>

export { statFilterSchema }

export type { StatFilterInput }
