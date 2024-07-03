import { Document } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import {
  getGranteRole,
  isCreator,
  isInSameStructure,
  isReferentFor
} from '../rules/helpers'

type SecurityDocument = Pick<Document, 'createdById' | 'confidential'>
type SecurityFamilyFile = SecurityTargetWithStructure &
  SecurityTargetWithReferents

export type DocumentPermissions = {
  edit: boolean
  view: boolean
  delete: boolean
  set: {
    confidential: boolean
  }
}

const FALSY_PERMISSIONS: DocumentPermissions = {
  edit: false,
  view: false,
  delete: false,
  set: {
    confidential: false
  }
}

export const getDocumentPermissions = ({
  ctx,
  familyFile,
  document
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityFamilyFile
  document?: SecurityDocument
}) => {
  let permissions: DocumentPermissions
  if (document) {
    permissions = getEditionPermissions({ ctx, familyFile, document })
  } else {
    permissions = getCreationPermissions()
  }

  return permissions
}

function getCreationPermissions() {
  return {
    edit: false,
    view: false,
    delete: false,
    set: {
      confidential: true
    }
  }
}

function getEditionPermissions(params: {
  ctx: SecurityRuleContext
  familyFile: SecurityFamilyFile
  document: SecurityDocument
}) {
  const { ctx, familyFile, document } = params
  const { user } = ctx

  if (!isInSameStructure(user, familyFile)) {
    return FALSY_PERMISSIONS
  }

  const creator = isCreator(user, document)
  const { manager, socialWorker, instructor } = getGranteRole(ctx)

  const isReferent = isReferentFor(user, familyFile)

  const view = document.confidential
    ? creator
    : manager || socialWorker || instructor || isReferent || creator
  const edit = view

  return {
    edit,
    view,
    delete: isReferent || manager || socialWorker,
    set: {
      confidential: creator
    }
  }
}
