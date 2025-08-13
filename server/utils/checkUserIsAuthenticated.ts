import type { JwtUser } from '~/server/lib/jwt'
import { forbidden } from '../../utils/api/errors'

export const checkUserIsAuthenticated = (user: JwtUser) => {
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbidden('Could not retrieve user info')
  }
}
