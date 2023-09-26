import { hasAllowedRole } from '~/server/security/rules/helpers'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export const canOnlyListItsBeneficiaries = (
  grantee: SecurityRuleGrantee
): boolean => hasAllowedRole(grantee, ['Referent'])
