import z from 'zod'

export const createMinisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  function: z.string(),
  ministry: z.string().nullish(),
  government: z.string().nullish(),
  former: z.boolean().default(false)
})

export type CreateMinisterInput = z.infer<typeof createMinisterSchema>
