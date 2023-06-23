import { z } from 'zod'

const accessTokenSchema = z.object({
  code: z.string(),
  state: z.string(),
  redirectUri: z.string()
})

type AccessTokenInput = z.infer<typeof accessTokenSchema>

export { accessTokenSchema }

export type { AccessTokenInput }
