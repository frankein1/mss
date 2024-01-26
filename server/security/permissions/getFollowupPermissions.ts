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

export type FollowupPermissions = {
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

const FALSY_PERMISSIONS: FollowupPermissions = {
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

export const getFollowupPermissions = ({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FollowupPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ ctx, beneficiary, socialSupport })
  }

  return permissions
}

function getCreationPermissions(): FollowupPermissions {
  return {
    edit: false,
    view: false,
    set: {
      privateSynthesis: true
    },
    get: {
      details: true,
      dueDate: true,
      privateSynthesis: true
    },
    delete: false
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
}): FollowupPermissions {
  const { user } = ctx
  if (!isInSameStructure(user, beneficiary)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, socialSupport)
  const isReferent = isReferentFor(user, beneficiary)
  const { manager, socialWorker, instructor, referent, receptionAgent } =
    getGranteRole(ctx)

  return {
    view: isReferent || manager || socialWorker || instructor || receptionAgent,
    edit: manager || creator,
    set: {
      privateSynthesis: creator
    },
    get: {
      details: manager || socialWorker || instructor || referent || creator,
      dueDate: manager || socialWorker || instructor || referent,
      privateSynthesis: creator
    },
    delete: manager || creator
  }
}
