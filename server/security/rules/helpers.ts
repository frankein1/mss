import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator,
  AllowedRoles
} from './types'

export const isAdmin = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'Administrator'
}

export const isInstructor = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'Instructor'
}

export const isReceptionAgent = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'ReceptionAgent'
}

export const isReferent = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'Referent'
}

export const isSocialWorker = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'SocialWorker'
}

export const isStructureManager = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'StructureManager'
}

export const getGranteRole = (grantee: SecurityRuleGrantee) => {
  return {
    manager: isStructureManager(grantee),
    socialWorker: isSocialWorker(grantee),
    referent: isReferent(grantee),
    receptionAgent: isReceptionAgent(grantee),
    instructor: isInstructor(grantee)
  }
}

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

export const isInSameStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
) => grantee.structureId === target.structureId

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents & SecurityTargetWithStructure
) =>
  isInSameStructureAs(grantee, target, ['Referent']) &&
  isPartOfReferents(grantee, target)

const isPartOfReferents = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents & SecurityTargetWithStructure
) =>
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
