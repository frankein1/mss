import { hasAllowedRole } from '~/server/security/rules/helpers'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export const canSaveBeneficiaryWithCompleteInfo = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])
