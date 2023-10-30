import { isCreator, isInSameStructure, isReferentFor } from './helpers'
import { PermissionRule, PermissionRuleWithCreator } from './types'

export type DocumentPermissionRules = {
  insert: PermissionRule
  select: {
    general: PermissionRule
    confidential: PermissionRuleWithCreator
  }
  update: {
    confidential: PermissionRuleWithCreator
  }
  delete: PermissionRule
}

const StructureManager: DocumentPermissionRules = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    confidential: isCreator
  },
  update: {
    confidential: isCreator
  },
  delete: isInSameStructure
}

const SocialWorker: DocumentPermissionRules = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    confidential: isCreator
  },
  update: {
    confidential: isCreator
  },
  delete: isInSameStructure
}

const Instructor: DocumentPermissionRules = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    confidential: isCreator
  },
  update: {
    confidential: isCreator
  },
  delete: () => false
}

const ReceptionAgent: DocumentPermissionRules = {
  insert: isInSameStructure,
  select: {
    general: isCreator,
    confidential: isCreator
  },
  update: {
    confidential: isCreator
  },
  delete: () => false
}

const Referent: DocumentPermissionRules = {
  insert: isReferentFor,
  select: {
    general: isReferentFor,
    confidential: isCreator
  },
  update: {
    confidential: isCreator
  },
  delete: isReferentFor
}

export const DocumentPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
