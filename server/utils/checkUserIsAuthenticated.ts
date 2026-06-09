import { forbidden } from '../../utils/api/errors'
import type { UserContext } from './fetchUserContext'

export const checkUserIsAuthenticated = (user: UserContext) => {
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId ||
    !user.structure
  ) {
    throw forbidden('Could not retrieve user info')
  }
}
