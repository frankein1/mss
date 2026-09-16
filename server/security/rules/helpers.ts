import { StructureType } from '@prisma/client'
import type {
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

/**
 * Élu / décideur : consulte les statistiques agrégées des structures qui
 * l'ont autorisé. Son périmètre vient de ses autorisations de partage, pas
 * de sa structure de rattachement.
 */
export const isDecisionMaker = (grantee: SecurityRuleGrantee) => {
  return grantee.role === 'DecisionMaker'
}

/**
 * Filtre de structures à appliquer dans les contraintes d'un décideur.
 *
 * Un tableau vide est renvoyé tel quel : `structureId: { in: [] }` ne remonte
 * aucune ligne, ce qui est le comportement voulu pour un décideur qui n'a
 * encore aucune autorisation. Ne jamais remplacer par une absence de filtre.
 */
export const decisionMakerStructureFilter = (grantee: SecurityRuleGrantee) => {
  return { in: grantee.authorizedStructureIds ?? [] }
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
    ngo: structure.type === StructureType.Association,
    cias: structure.type === StructureType.Cias,
    ccas: structure.type === StructureType.Ccas,
    city: structure.type === StructureType.Commune
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
  target: SecurityTargetWithReferents
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
