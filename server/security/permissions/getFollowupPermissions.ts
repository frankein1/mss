import type {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext
} from '../rules'
import {
  isReferentFor,
  isCreator,
  isInSameStructure,
  getGranteRole,
  isMemberOfReferents
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
  print?: boolean
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
  delete: false,
  print: false
}

export const getFollowupPermissions = ({
  ctx,
  familyFile,
  socialSupport
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FollowupPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ ctx, familyFile, socialSupport })
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
  familyFile,
  socialSupport
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FollowupPermissions {
  const { user } = ctx
  if (!isInSameStructure(user, familyFile)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, socialSupport)
  // isReferent = is member of referent list for this family file and has role Referent
  const isReferent = isReferentFor(user, familyFile)
  const { manager, socialWorker, instructor, referent, receptionAgent } =
    getGranteRole(ctx)
  const isMember = isMemberOfReferents(user, familyFile)

  return {
    view: isReferent || manager || socialWorker || instructor || receptionAgent,
    edit:
      manager ||
      (socialWorker && (creator || isMember)) ||
      (instructor && creator) ||
      (referent && (creator || isMember)) ||
      (receptionAgent && creator),
    set: {
      privateSynthesis: creator
    },
    get: {
      details:
        manager ||
        socialWorker ||
        instructor ||
        referent ||
        creator ||
        receptionAgent,
      dueDate: manager || socialWorker || instructor || referent,
      privateSynthesis: creator
    },
    delete: manager || creator,
    print:
      manager ||
      socialWorker ||
      (instructor && creator) ||
      (receptionAgent && creator) ||
      (referent && isReferent)
  }
}
