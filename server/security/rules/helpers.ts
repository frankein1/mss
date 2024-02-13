import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext,
  SecurityTargetWithReferents
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

export const getGranteRole = (ctx: SecurityRuleContext) => {
  const { user, structure } = ctx
  return {
    manager: isStructureManager(user),
    socialWorker: isSocialWorker(user),
    referent: isReferent(user),
    receptionAgent: isReceptionAgent(user),
    instructor: isInstructor(user),
    ministryAgent: structure.type === StructureType.Ministere,
    cias: structure.type === StructureType.Cias,
    ccas: structure.type === StructureType.Ccas
  }
}

export const isInSameStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
) => grantee.structureId === target.structureId

export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithCreator
) =>
  'createdById' in target
    ? grantee.id === target.createdById
    : grantee.id === target.createdBy?.id

export const isMemberOfReferents = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents & SecurityTargetWithStructure
) =>
  target.referents.some(r =>
    typeof r === 'string' ? r === grantee.id : r.id === grantee.id
  )

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents & SecurityTargetWithStructure
) => {
  const isMember = isMemberOfReferents(grantee, target)
  return isMember && isReferent(grantee)
}
