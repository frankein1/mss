import { minutesToMillis } from '../time'

type CookieOptions = {
  path: string
  httpOnly: boolean
  secure: boolean
  expires?: Date
  sameSite: boolean | 'strict' | 'lax' | 'none'
}

export const cookieOptions = (
  {
    expiresInMinutes
  }: {
    expiresInMinutes: number | undefined
  } = { expiresInMinutes: undefined }
): CookieOptions => {
  return {
    path: '/',
    httpOnly: true,
    secure: true,
    ...(expiresInMinutes && {
      expires: new Date(Date.now() + minutesToMillis(expiresInMinutes))
    }),
    sameSite: 'lax'
  }
}
