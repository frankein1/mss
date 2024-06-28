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
  view: {
    documents: boolean
    history: boolean
  }
  create: {
    helpRequest: boolean
    document: boolean
    followup: boolean
    comment: boolean
  }
}

const FALSY_PERMISSIONS: FamilyFilePermissions = {
  view: {
    documents: false,
    history: false
  },
  create: {
    helpRequest: false,
    document: false,
    followup: false,
    comment: false
  }
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
  return {
    view: {
      documents: false,
      history: false
    },
    create: {
      helpRequest: false,
      document: false,
      followup: false,
      comment: false
    }
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

  const { manager, socialWorker, instructor, receptionAgent } =
    getGranteRole(ctx)

  const hasAccessRight =
    isReferent || manager || socialWorker || instructor || receptionAgent
  const hasRestrictedRights =
    isReferent || manager || socialWorker || instructor

  return {
    view: {
      documents: hasAccessRight,
      history: hasAccessRight
    },
    create: {
      helpRequest: hasRestrictedRights,
      document: hasAccessRight,
      followup: hasAccessRight,
      comment: hasAccessRight
    }
  }
}
