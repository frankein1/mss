import { isInSameStructure } from './helpers'

const StructureManager = {
  select: true,
  insert: true,
  update: isInSameStructure
}

const SocialWorker = {
  select: false,
  insert: false,
  update: false
}

const Instructor = {
  select: false,
  insert: false,
  update: false
}

const ReceptionAgent = {
  select: false,
  insert: false,
  update: false
}

const Referent = {
  select: false,
  insert: false,
  update: false
}

export const UserPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
