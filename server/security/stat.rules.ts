const StructureManager = {
  select: {
    general: true,
    byReferent: true
  },
  export: true
}

const SocialWorker = {
  select: {
    general: true,
    byReferent: false
  },
  export: true
}

const Instructor = {
  select: {
    general: true,
    byReferent: false
  },
  export: true
}

const ReceptionAgent = {
  select: {
    general: true,
    byReferent: false
  },
  export: false
}

const Referent = {
  select: {
    general: true,
    byReferent: false
  },
  export: true
}

export const StatPermissionRules = {
  StructureManager,
  SocialWorker,
  Instructor,
  ReceptionAgent,
  Referent
}
