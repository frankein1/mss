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

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
) =>
  hasAllowedRole(grantee, ['StructureManager']) &&
  grantee.structureId === target.structureId

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles
) =>
  grantee.structureId === target.structureId &&
  hasAllowedRole(grantee, allowedRoles)

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents
) =>
  hasAllowedRole(grantee, ['Referent']) &&
  target.referents.some(r =>
    typeof r === 'string' ? r === grantee.id : r.id === grantee.id
  )

export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: { createdById?: string | null },
  allowedRoles: AllowedRoles
) => grantee.id === target.createdById && hasAllowedRole(grantee, allowedRoles)
