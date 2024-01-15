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
    getGranteRole(ctx)

  const isEFS = structure.type === StructureType.EFS

  return {
    edit: {
      general:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      relatives:
        !isEFS && (isReferent || manager || socialWorker || instructor),
      health: !isEFS && (isReferent || manager || socialWorker || instructor),
      occupationIncome:
        !isEFS && (isReferent || manager || socialWorker || instructor),
      externalOrganisations: isReferent || manager || socialWorker || instructor
    },
    get: {
      nir: hasAccessNir(structure.type)
    },
    set: {
      referents: isReferent || manager || socialWorker || instructor,
      nir: hasAccessNir(structure.type)
    },
    view: {
      general:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      relatives:
        !isEFS && (isReferent || manager || socialWorker || instructor),
      health: !isEFS && (isReferent || manager || socialWorker || instructor),
      occupationIncome:
        !isEFS && (isReferent || manager || socialWorker || instructor),
      externalOrganisations:
        isReferent || manager || socialWorker || instructor,
      documents:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      history:
        isReferent || manager || socialWorker || instructor || receptionAgent
    },
    create: {
      helpRequest: isReferent || manager || socialWorker || instructor,
      document:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      followup:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      comment:
        isReferent || manager || socialWorker || instructor || receptionAgent
    },
    delete: {
      beneficiary: isReferent || manager || socialWorker
    }
  }
}

function hasAccessNir(type: StructureType) {
  return type === StructureType.Ccas || type === StructureType.Cias
}
