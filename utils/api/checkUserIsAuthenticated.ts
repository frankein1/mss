import { JwtUser } from '~/types/user'
import { forbidden } from './errors'

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
