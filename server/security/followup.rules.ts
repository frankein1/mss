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
  export: true,
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
  export: true,
  delete: isCreator
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
  export: true,
  delete: isCreator
}

const ReceptionAgent = {
  insert: isInSameStructure,
  select: {
    general: isInSameStructure,
    detail: isCreator,
    privateSynthesis: isCreator
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  export: false,
  delete: isCreator
}

const Referent = {
  insert: isReferentFor,
  select: {
    general: isReferentFor,
    detail: isInSameStructure,
    privateSynthesis: isCreator
  },
  update: {
    general: isCreator,
    privateSynthesis: isCreator
  },
  export: true,
  delete: isCreator
}

export const FollowupPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
