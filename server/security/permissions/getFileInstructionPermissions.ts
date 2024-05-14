import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext
} from '../rules'
import {
  isReferentFor,
  isCreator,
  isInSameStructure,
  getGranteRole
} from '../rules/helpers'

export type FileInstructionPermissions = {
  edit: boolean
  view: boolean
  get: {
    details: boolean
    privateSynthesis: boolean
  }
  set: {
    privateSynthesis: boolean
  }
  delete: boolean
}

const FALSY_PERMISSIONS: FileInstructionPermissions = {
  edit: false,
  view: false,
  get: {
    details: false,
    privateSynthesis: false
  },
  set: {
    privateSynthesis: false
  },
  delete: false
}

export const getFileInstructionPermissions = ({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FileInstructionPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ ctx, beneficiary, socialSupport })
  }

  return permissions
}

function getCreationPermissions(): FileInstructionPermissions {
  return {
    edit: true,
    view: true,
    get: {
      details: true,
      privateSynthesis: true
    },
    set: {
      privateSynthesis: true
    },
    delete: true
  }
}

function getEditionPermissions({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FileInstructionPermissions {
  const { user } = ctx

  if (!isInSameStructure(user, beneficiary)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, socialSupport)
  const isReferent = isReferentFor(user, beneficiary)
  const { manager, socialWorker, instructor, receptionAgent, referent } =
    getGranteRole(ctx)

  return {
    edit: manager || (creator && (socialWorker || instructor || referent)),
    view: isReferent || manager || socialWorker || instructor || receptionAgent,
    get: {
      details: manager || socialWorker || instructor || isReferent,
      privateSynthesis: creator
    },
    set: {
      privateSynthesis: creator
    },
    delete: manager || creator
  }
}
