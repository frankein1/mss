import { minutesToMillis } from '../time'

type CookieOptions = {
  path: string
  httpOnly: boolean
  secure: boolean
  expires: Date
  sameSite: boolean | 'strict' | 'lax' | 'none'
}

export const cookieOptions = ({
  expiresInMinutes
}: {
  expiresInMinutes: number
}): CookieOptions => {
  return {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + minutesToMillis(expiresInMinutes)),
    sameSite: 'lax'
  }
}
