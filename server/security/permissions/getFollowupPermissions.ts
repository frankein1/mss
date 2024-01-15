import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator
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

export const getFollowupPermissions = ({
  user,
  beneficiary,
  socialSupport
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FollowupPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ user, beneficiary, socialSupport })
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
  user,
  beneficiary,
  socialSupport
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FollowupPermissions {
  if (!isInSameStructure(user, beneficiary)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, socialSupport)
  const isReferent = isReferentFor(user, beneficiary)
  const { manager, socialWorker, instructor, referent, receptionAgent } =
    getGranteRole(user)

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
