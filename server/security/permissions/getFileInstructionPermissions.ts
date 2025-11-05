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
  print?: boolean
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
  delete: false,
  print: false
}

export const getFileInstructionPermissions = ({
  ctx,
  familyFile,
  socialSupport
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FileInstructionPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermissions({ ctx, familyFile, socialSupport })
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
  familyFile,
  socialSupport
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FileInstructionPermissions {
  const { user } = ctx

  if (!isInSameStructure(user, familyFile)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, socialSupport)
  const isReferent = isReferentFor(user, familyFile)
  const { manager, socialWorker, instructor, receptionAgent, referent } =
    getGranteRole(ctx)

  const isMember = isMemberOfReferents(user, familyFile)

  return {
    edit:
      manager ||
      (socialWorker && (creator || isMember)) ||
      (instructor && creator) ||
      (referent && (creator || isMember)),
    view: isReferent || manager || socialWorker || instructor || receptionAgent,
    get: {
      details: manager || socialWorker || instructor || isReferent,
      privateSynthesis: creator
    },
    set: {
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
