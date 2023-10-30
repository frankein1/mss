import { isCreator } from './helpers'

const StructureManager = {
  update: isCreator,
  delete: isCreator
}

const SocialWorker = {
  update: isCreator,
  delete: isCreator
}

const Instructor = {
  update: isCreator,
  delete: isCreator
}

const ReceptionAgent = {
  update: isCreator,
  delete: isCreator
}

const Referent = {
  update: isCreator,
  delete: isCreator
}

export const DraftPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
