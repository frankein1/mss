import pkg, { JwtPayload } from 'jsonwebtoken'
import { JwtUser } from '~/types/user'
import { minutesToSeconds } from '~/utils/time'

// eslint-disable-next-line import/no-named-as-default-member
const { sign, verify } = pkg

export function verifyJwt(token: string, jwtKey: string): JwtPayload {
  return verify(token, jwtKey) as JwtPayload
}

export function signJwt(
  user: JwtUser,
  jwtKey: string,
  expiresInMinutes: number
) {
  const sessionToken = sign(
    {
      user: {
        email: user.email,
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
        status: user.status,
        structureId: user.structureId,
        structureType: user.structureType,
        CGUHistoryVersion: user.CGUHistoryVersion
      }
    },
    jwtKey,
    {
      algorithm: 'HS256',
      expiresIn: minutesToSeconds(expiresInMinutes)
    }
  )
  return sessionToken
}
