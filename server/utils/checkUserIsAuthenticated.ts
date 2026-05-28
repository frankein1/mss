import type { SecurityRuleGrantee } from '~/server/security'
import { forbidden } from '../../utils/api/errors'

export const checkUserIsAuthenticated = (user: SecurityRuleGrantee) => {
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbidden('Could not retrieve user info')
  }
}
