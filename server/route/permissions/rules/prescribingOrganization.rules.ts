import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

const canCreate = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const prescribingOrgaRule = {
  canCreate
}
