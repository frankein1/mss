type CooieOptions = {
  httpOnly: boolean
  secure: boolean
  expires: Date
  sameSite: boolean | 'strict' | 'none'
}

export const cookieOptions = ({
  expiresIn
}: {
  expiresIn: number
}): CooieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000),
    sameSite: 'strict'
  }
}
