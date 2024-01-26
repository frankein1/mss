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

export type HelpRequestPermissions = {
  edit: boolean
  view: boolean
  get: {
    details: boolean
    dueDate: boolean
    privateSynthesis: boolean
  }
  set: {
    privateSynthesis: boolean
  }
  delete: boolean
}

const FALSY_PERMISSIONS = {
  edit: false,
  view: false,
  get: {
    details: false,
    dueDate: false,
    privateSynthesis: false
  },
  set: {
    privateSynthesis: false
  },
  delete: false
}

export const getHelpRequestPermissions = ({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: HelpRequestPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ ctx, beneficiary, socialSupport })
  }

  return permissions
}

function getCreationPermissions(): HelpRequestPermissions {
  return {
    edit: true,
    view: true,
    get: {
      details: true,
      dueDate: true,
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
}): HelpRequestPermissions {
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
      dueDate: manager || socialWorker || instructor || referent,
      privateSynthesis: creator
    },
    set: {
      privateSynthesis: creator
    },
    delete: manager || socialWorker || (instructor && creator) || isReferent
  }
}
