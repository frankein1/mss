import { Document, StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canDeleteDocument,
  canEditDocument,
  canSetDocumentAsConfidential,
  canViewDocument
} from '../rules'

type SecurityDocument = Pick<Document, 'createdById' | 'confidential'>
type SecurityBeneficiary = SecurityTargetWithStructure &
  SecurityTargetWithReferents

export type DocumentPermissions = {
  edit: boolean
  view: boolean
  delete: boolean
  set: {
    confidential: boolean
  }
}

export const getDocumentPermissions = (params: {
  user: SecurityRuleGrantee
  beneficiary: SecurityBeneficiary
  structure: { type: StructureType }
  document: SecurityDocument
}) => {
  let permissions: DocumentPermissions
  if (!params.document) {
    permissions = getCreatePermissions()
  } else {
    permissions = getEditPermissions(params)
  }

  return permissions
}

function getCreatePermissions() {
  return {
    edit: false,
    view: false,
    delete: false,
    set: {
      confidential: true
    }
  }
}

function getEditPermissions(params: {
  user: SecurityRuleGrantee
  beneficiary: SecurityBeneficiary
  structure: { type: StructureType }
  document: SecurityDocument
}) {
  const { user, beneficiary, document } = params
  return {
    edit: canEditDocument(user, beneficiary, document),
    view: canViewDocument(user, beneficiary, document),
    delete: canDeleteDocument(user, beneficiary),
    set: {
      confidential: canSetDocumentAsConfidential(user, beneficiary, document)
    }
  }
}
