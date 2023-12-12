import { minutesToMillis } from '../time'

type CookieOptions = {
  httpOnly: boolean
  secure: boolean
  expires: Date
  sameSite: boolean | 'strict' | 'none'
}

export const cookieOptions = ({
  expiresInMinutes
}: {
  expiresInMinutes: number
}): CookieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + minutesToMillis(expiresInMinutes)),
    sameSite: 'strict'
  }
}
