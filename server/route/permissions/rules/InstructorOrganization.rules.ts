import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

export const canCreate = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const instructorOrgaRule = {
  canCreate
}
