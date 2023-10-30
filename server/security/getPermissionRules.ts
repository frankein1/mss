import { beneficiaryPermissionRules } from './beneficiary.rules'
import { SecurityRuleGrantee } from './types'

export const getBeneficiaryPermissionRules = (user: SecurityRuleGrantee) => {
  if (user.role === 'Administrator') {
    throw new Error('Administrator has no permission rules')
  }
  return beneficiaryPermissionRules[user.role]
}
