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

export type FamilyFilePermissions = {
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
  create: {
    helpRequest: boolean
    document: boolean
    followup: boolean
    comment: boolean
  }
  delete: boolean
}

const FALSY_PERMISSIONS: FamilyFilePermissions = {
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
  create: {
    helpRequest: false,
    document: false,
    followup: false,
    comment: false
  },
  delete: false
}

export const getFamilyFilePermissions = ({
  ctx,
  familyFile
}: {
  ctx: SecurityRuleContext
  familyFile?: SecurityTargetWithStructure & SecurityTargetWithReferents
}) => {
  let permissions: FamilyFilePermissions
  if (!familyFile) {
    permissions = getCreationPermissions({ ctx })
  } else {
    permissions = getEditionPermissions({ ctx, familyFile })
  }

  return permissions
}

function getCreationPermissions({ ctx }: { ctx: SecurityRuleContext }) {
  const { receptionAgent } = getGranteRole(ctx)
  return {
    edit: {
      general: true,
      externalOrganisations: true,
      relatives: !receptionAgent,
      health: !receptionAgent,
      occupationIncome: !receptionAgent
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
    create: {
      helpRequest: false,
      document: false,
      followup: false,
      comment: false
    },
    delete: false
  }
}

function getEditionPermissions({
  ctx,
  familyFile
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
}) {
  const { user } = ctx

  if (!isInSameStructure(user, familyFile)) {
    return FALSY_PERMISSIONS
  }

  const isReferent = isReferentFor(user, familyFile)
  const isMember = isMemberOfReferents(user, familyFile)

  const { manager, socialWorker, instructor, receptionAgent } =
    getGranteRole(ctx)

  const hasAccessRight =
    isReferent || manager || socialWorker || instructor || receptionAgent
  const hasRestrictedRights =
    isReferent || manager || socialWorker || instructor
  const hasHealthAccessRight =
    isReferent || ((manager || socialWorker || instructor) && isMember)

  return {
    edit: {
      general: hasAccessRight,
      relatives: hasRestrictedRights,
      health: hasHealthAccessRight,
      occupationIncome: hasRestrictedRights,
      externalOrganisations: hasRestrictedRights
    },
    view: {
      general: hasAccessRight,
      relatives: hasRestrictedRights,
      occupationIncome: hasRestrictedRights,
      health: hasHealthAccessRight,
      externalOrganisations: hasRestrictedRights,
      documents: hasAccessRight,
      history: hasAccessRight
    },
    create: {
      helpRequest: hasRestrictedRights,
      document: hasAccessRight,
      followup: hasAccessRight,
      comment: hasAccessRight
    },
    delete: manager || socialWorker
  }
}
