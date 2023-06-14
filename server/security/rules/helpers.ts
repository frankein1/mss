import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  AllowedRoles
} from './types'

export const isActiveWithAllowedRole = (
  grantee: SecurityRuleGrantee,
  allowedRoles: AllowedRoles
) =>
  grantee.status === 'Active' &&
  allowedRoles.includes(grantee.role) &&
  (grantee.role === 'Administrator' || !!grantee.structureId)

export const isAdministrator = (grantee: SecurityRuleGrantee) =>
  isActiveWithAllowedRole(grantee, ['Administrator'])

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target?: SecurityTargetWithStructure
) =>
  isActiveWithAllowedRole(grantee, ['StructureManager']) &&
  (!target || grantee.structureId === target.structureId)

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles
) =>
  !!grantee.structureId &&
  grantee.structureId === target.structureId &&
  isActiveWithAllowedRole(grantee, allowedRoles)

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents
) =>
  isActiveWithAllowedRole(grantee, ['Referent']) &&
  target.referents.some(({ id }) => id === grantee.id)
