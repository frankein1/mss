import type { JwtData } from '~/server/lib/jwt'

export const parseJwt = (token: string): JwtData => {
  try {
    const end = token.split('.')?.[1]
    if (!end) {
      throw new Error()
    }
    return JSON.parse(Buffer.from(end, 'base64').toString())
  } catch {
    throw new Error('token is not parsable')
  }
}
