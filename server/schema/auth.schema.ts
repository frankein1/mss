import { z } from 'zod'

const accessTokenSchema = z.object({
  code: z.string(),
  state: z.string(),
  redirectUri: z.string()
})

type AccessTokenInput = z.infer<typeof accessTokenSchema>

const acceptCGUSchema = z.object({
  read: z.coerce
    .boolean()
    .refine(value => value === true, { message: 'Veuillez lire les CGU.' }),
  accept: z.coerce
    .boolean()
    .refine(value => value === true, { message: 'Veuillez accepter les CGU.' })
})

type AcceptCGUInput = z.infer<typeof acceptCGUSchema>

export { accessTokenSchema, acceptCGUSchema }

export type { AccessTokenInput, AcceptCGUInput }
