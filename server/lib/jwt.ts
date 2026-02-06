import pkg from 'jsonwebtoken'
import { minutesToSeconds } from '~/utils/time'
import { z } from 'zod'

const { sign, verify } = pkg

export const MSS_SIGNING_ALGORITHM = 'HS256'

const jwtUserSchema = z.object({
  id: z.string().uuid()
})

export type JwtUser = z.infer<typeof jwtUserSchema>

export type JwtData = {
  user: JwtUser
  iat: number
  exp: number
}

export function verifyJwt(token: string, jwtKey: string) {
  const payload = verify(token, jwtKey, {
    algorithms: [MSS_SIGNING_ALGORITHM]
  })
  if (typeof payload === 'string' || payload.user === undefined) {
    throw new Error('jwt: wrong format for token')
  }

  const parsedPayload = jwtUserSchema.safeParse(payload.user)
  if (parsedPayload.success === false) {
    throw new Error('jwt: wrong content for token')
  }

  return { user: parsedPayload.data }
}

export function signJwt(
  user: JwtUser,
  jwtKey: string,
  expiresInMinutes: number
) {
  const sessionToken = sign({ user }, jwtKey, {
    algorithm: MSS_SIGNING_ALGORITHM,
    expiresIn: minutesToSeconds(expiresInMinutes)
  })
  return sessionToken
}
