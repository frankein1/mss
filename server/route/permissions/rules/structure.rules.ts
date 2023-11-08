import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

const canEdit = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const structureRule = {
  canEdit
}
