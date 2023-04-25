import { JwtData } from '~/types/user'

export const parseJwt = (token: string): JwtData => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (e) {
    throw new Error('token is not parsable')
  }
}
