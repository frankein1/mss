import type { JwtData } from '~/server/lib/jwt'

export const parseJwt = (token: string): JwtData => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch {
    throw new Error('token is not parsable')
  }
}
