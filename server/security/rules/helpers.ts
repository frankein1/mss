import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  AllowedRoles
} from './types'

export const hasAllowedRole = (
  grantee: SecurityRuleGrantee,
  allowedRoles: AllowedRoles
) => allowedRoles.includes(grantee.role)

export const isAdministrator = (grantee: SecurityRuleGrantee) =>
  hasAllowedRole(grantee, ['Administrator'])

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target?: SecurityTargetWithStructure
) =>
  hasAllowedRole(grantee, ['StructureManager']) &&
  (!target || grantee.structureId === target.structureId)

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles
) =>
  !!grantee.structureId &&
  grantee.structureId === target.structureId &&
  hasAllowedRole(grantee, allowedRoles)

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents
) =>
  hasAllowedRole(grantee, ['Referent']) &&
  target.referents.some(({ id }) => id === grantee.id)
