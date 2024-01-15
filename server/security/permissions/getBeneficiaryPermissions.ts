import { StructureType } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import {
  getGranteRole,
  isInSameStructure,
  isReferentFor
} from '../rules/helpers'

export type BeneficiaryPermissions = {
  edit: {
    general: boolean
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
  }
  view: {
    general: boolean
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
    documents: boolean
    history: boolean
  }
  get: {
    nir: boolean
  }
  set: {
    referents: boolean
    nir: boolean
  }

  create: {
    helpRequest: boolean
    document: boolean
    followup: boolean
    comment: boolean
  }
  delete: {
    beneficiary: boolean
  }
}

const FALSY_PERMISSIONS = {
  edit: {
    general: false,
    relatives: false,
    health: false,
    occupationIncome: false,
    externalOrganisations: false
  },
  view: {
    general: false,
    relatives: false,
    health: false,
    occupationIncome: false,
    externalOrganisations: false,
    documents: false,
    history: false
  },
  get: {
    nir: false
  },
  set: {
    referents: false,
    nir: false
  },
  create: {
    helpRequest: false,
    document: false,
    followup: false,
    comment: false
  },
  delete: {
    beneficiary: false
  }
}

export const getBeneficiaryPermissions = ({
  ctx,
  beneficiary
}: {
  ctx: SecurityRuleContext
  beneficiary?: SecurityTargetWithStructure & SecurityTargetWithReferents
}) => {
  let permissions: BeneficiaryPermissions
  if (!beneficiary) {
    permissions = getCreationPermissions({ ctx })
  } else {
    permissions = getEditionPermissions({ ctx, beneficiary })
  }

  return permissions
}

function getCreationPermissions({ ctx }: { ctx: SecurityRuleContext }) {
  const { structure } = ctx
  const isEFS = structure.type === StructureType.EFS
  return {
    edit: {
      general: true,
      relatives: !isEFS,
      health: !isEFS,
      occupationIncome: !isEFS,
      externalOrganisations: true
    },
    view: {
      general: false,
      relatives: false,
      health: false,
      occupationIncome: false,
      externalOrganisations: false,
      documents: false,
      history: false
    },
    get: {
      nir: hasAccessNir(structure.type)
    },
    set: {
      referents: true,
      nir: hasAccessNir(structure.type)
    },

    create: {
      helpRequest: false,
      document: false,
      followup: false,
      comment: false
    },
    delete: {
      beneficiary: false
    }
  }
}

function getEditionPermissions({
  ctx,
  beneficiary
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
}) {
  const { user, structure } = ctx

  if (!isInSameStructure(user, beneficiary)) {
    return FALSY_PERMISSIONS
  }

  const isReferent = isReferentFor(user, beneficiary)

  const { manager, socialWorker, instructor, receptionAgent } =
    getGranteRole(user)

  const managerOrWorkerOrInstructorOrAgent =
    manager || socialWorker || instructor || receptionAgent

  const managerOrWorkerOrInstructor = manager || socialWorker || instructor

  const managerOrWorker = manager || socialWorker

  const isEFS = structure.type === StructureType.EFS

  return {
    edit: {
      general: isReferent || managerOrWorkerOrInstructorOrAgent,
      relatives: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      health: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      occupationIncome: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      externalOrganisations: isReferent || managerOrWorkerOrInstructor
    },
    get: {
      nir: hasAccessNir(structure.type)
    },
    set: {
      referents: isReferent || managerOrWorkerOrInstructor,
      nir: hasAccessNir(structure.type)
    },
    view: {
      general: isReferent || managerOrWorkerOrInstructorOrAgent,
      relatives: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      health: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      occupationIncome: !isEFS && (isReferent || managerOrWorkerOrInstructor),
      externalOrganisations: isReferent || managerOrWorkerOrInstructor,
      documents: isReferent || managerOrWorkerOrInstructorOrAgent,
      history: isReferent || managerOrWorkerOrInstructorOrAgent
    },
    create: {
      helpRequest: isReferent || managerOrWorkerOrInstructor,
      document: isReferent || managerOrWorkerOrInstructorOrAgent,
      followup: isReferent || managerOrWorkerOrInstructorOrAgent,
      comment: isReferent || managerOrWorkerOrInstructorOrAgent
    },
    delete: {
      beneficiary: isReferent || managerOrWorker
    }
  }
}

function hasAccessNir(type: StructureType) {
  return type === StructureType.Ccas || type === StructureType.Cias
}
