import { isCreator, isInSameStructure, isReferentFor } from './helpers'

const StructureManager = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    privateSynthesis: isCreator
  },
  update: {
    general: isInSameStructure,
    privateSynthesis: isCreator
  },
  delete: isInSameStructure
}

const SocialWorker = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    privateSynthesis: isCreator
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  delete: isInSameStructure
}

const Instructor = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    privateSynthesis: isCreator
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  delete: isCreator
}

const ReceptionAgent = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    detail: false,
    privateSynthesis: isCreator
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  delete: false
}

const Referent = {
  insert: isReferentFor,
  select: {
    general: isReferentFor,
    detail: isReferentFor,
    privateSynthesis: false
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  delete: false
}

export const HelpRequestPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}

// export const canViewAnyHelpRequestDetails = (
//   grantee: SecurityRuleGrantee
// ): boolean =>
//   hasAllowedRole(grantee, [
//     'StructureManager',
//     'SocialWorker',
//     'Instructor',
//     'Referent'
//   ])
