import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  AllowedRoles
} from './types'

export const isActiveWithAllowedRole = (
  grantee: SecurityRuleGrantee,
  allowedRoles: AllowedRoles
) => grantee.status === 'Active' && allowedRoles.includes(grantee.role)

export const isAdministrator = (grantee: SecurityRuleGrantee) =>
  isActiveWithAllowedRole(grantee, ['Administrator'])

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target?: SecurityTargetWithStructure
) =>
  isActiveWithAllowedRole(grantee, ['StructureManager']) &&
  (!target || grantee.structureId === target.structureId)
