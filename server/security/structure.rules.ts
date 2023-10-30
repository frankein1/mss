import { isInSameStructure } from './helpers'

const StructureManager = {
  select: true,
  update: isInSameStructure
}

const SocialWorker = {
  select: true,
  update: false
}

const Instructor = {
  select: true,
  update: false
}

const ReceptionAgent = {
  select: true,
  update: false
}

const Referent = {
  select: true,
  update: false
}

export const StructurePermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
