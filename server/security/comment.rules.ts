import { UserRole } from '@prisma/client'
import { isInSameStructure } from './helpers'
import {
  PermissionRule,
  PermissionRulesRole,
  SecurityRuleGrantee
} from './types'

export type CommentPermissionRules = {
  insert: PermissionRule
  select: PermissionRule
}

const StructureManager = {
  insert: isInSameStructure,
  select: isInSameStructure
}

const SocialWorker = {
  insert: isInSameStructure,
  select: isInSameStructure
}

const Instructor = {
  insert: isInSameStructure,
  select: isInSameStructure
}

const ReceptionAgent = {
  insert: isInSameStructure,
  select: isInSameStructure
}

const Referent = {
  insert: isInSameStructure,
  select: isInSameStructure
}

const permissionRules: {
  [key in PermissionRulesRole]: CommentPermissionRules
} = {
  [UserRole.StructureManager]: StructureManager,
  [UserRole.SocialWorker]: SocialWorker,
  [UserRole.Instructor]: Instructor,
  [UserRole.ReceptionAgent]: ReceptionAgent,
  [UserRole.Referent]: Referent
}

export const getCommentPermissionRules = (user: SecurityRuleGrantee) => {
  if (user.role === 'Administrator') {
    throw new Error('Administrator has no permission rules')
  }
  return permissionRules[user.role]
}
