// eslint-disable-next-line import/default
import pkg, { JwtPayload } from 'jsonwebtoken'
import { JwtUser } from '~/types/user'

// eslint-disable-next-line import/no-named-as-default-member
const { sign, verify } = pkg

const expiresIn = 15 * 60

export function verifyJwt(token: string, jwtKey: string): JwtPayload {
  return verify(token, jwtKey) as JwtPayload
}

export function signJwt(user: JwtUser, jwtKey: string) {
  const sessionToken = sign(
    {
      user: {
        email: user.email,
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
        inclusionConnectId: user.inclusionConnectId,
        structureId: user.structureId,
        structureType: user.structureType
      }
    },
    jwtKey,
    {
      algorithm: 'HS256',
      expiresIn
    }
  )
  return { sessionToken, expiresIn }
}
