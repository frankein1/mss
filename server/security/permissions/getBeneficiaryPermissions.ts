import {
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import {
  getGranteRole,
  isInSameStructure,
  isMemberOfReferents,
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
  }
  list: { documents: boolean; history: boolean }
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
    externalOrganisations: false
  },
  list: {
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
  const { efs, cias, ccas, receptionAgent } = getGranteRole(ctx)
  return {
    edit: {
      general: true,
      relatives: !efs && !receptionAgent,
      health: !efs && !receptionAgent,
      occupationIncome: !efs && !receptionAgent,
      externalOrganisations: true
    },
    view: {
      general: false,
      relatives: false,
      health: false,
      occupationIncome: false,
      externalOrganisations: false
    },
    list: {
      documents: false,
      history: false
    },
    get: {
      nir: cias || ccas
    },
    set: {
      referents: true,
      nir: cias || ccas
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
  const { user } = ctx

  if (!isInSameStructure(user, beneficiary)) {
    return FALSY_PERMISSIONS
  }

  const isReferent = isReferentFor(user, beneficiary)
  const isMember = isMemberOfReferents(user, beneficiary)

  const { manager, socialWorker, instructor, receptionAgent, cias, ccas, efs } =
    getGranteRole(ctx)

  return {
    edit: {
      general:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      relatives: !efs && (isReferent || manager || socialWorker || instructor),
      health:
        !efs &&
        (isReferent || ((manager || socialWorker || instructor) && isMember)),
      occupationIncome:
        !efs && (isReferent || manager || socialWorker || instructor),
      externalOrganisations: isReferent || manager || socialWorker || instructor
    },
    get: {
      nir: cias || ccas
    },
    set: {
      referents: isReferent || manager || socialWorker || instructor,
      nir: cias || ccas
    },
    view: {
      general:
        isReferent || manager || socialWorker || instructor || receptionAgent,
      relatives: !efs && (isReferent || manager || socialWorker || instructor),
      health:
        !efs &&
        (isReferent || ((manager || socialWorker || instructor) && isMember)),
      occupationIncome:
        !efs && (isReferent || manager || socialWorker || instructor),
      externalOrganisations: isReferent || manager || socialWorker || instructor
    },
    list: {
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
      beneficiary: manager || socialWorker
    }
  }
}
