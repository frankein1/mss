import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator,
  AllowedRoles
} from './types'

export const hasAllowedRole = (
  grantee: SecurityRuleGrantee,
  allowedRoles: AllowedRoles
) => allowedRoles.includes(grantee.role)

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles
) =>
  grantee.structureId === target.structureId &&
  hasAllowedRole(grantee, allowedRoles)

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
) => isInSameStructureAs(grantee, target, ['StructureManager'])

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents & SecurityTargetWithStructure
) =>
  isInSameStructureAs(grantee, target, ['Referent']) &&
  target.referents.some(r =>
    typeof r === 'string' ? r === grantee.id : r.id === grantee.id
  )

export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithCreator
) =>
  'createdById' in target
    ? grantee.id === target.createdById
    : grantee.id === target.createdBy?.id
