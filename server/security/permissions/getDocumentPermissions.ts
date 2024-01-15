import { Document } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityRuleGrantee,
  SecurityTargetWithCreator,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  isInSameStructureAs
} from '../rules'
import { isCreator, isReferentFor } from '../rules/helpers'

type SecurityDocument = Pick<Document, 'createdById' | 'confidential'>
type SecurityBeneficiary = SecurityTargetWithStructure &
  SecurityTargetWithReferents

export type DocumentPermissions = {
  create: boolean
  edit: boolean
  view: boolean
  delete: boolean
  set: {
    confidential: boolean
  }
}

export const getDocumentPermissions = ({
  ctx,
  beneficiary,
  document
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityBeneficiary
  document?: SecurityDocument
}) => {
  let permissions: DocumentPermissions
  if (document) {
    permissions = getEditionPermission({ ctx, beneficiary, document })
  } else {
    permissions = getCreationPermissions()
  }

  return permissions
}

function getCreationPermissions() {
  return {
    create: true,
    edit: false,
    view: false,
    delete: false,
    set: {
      confidential: true
    }
  }
}

function getEditionPermission(params: {
  ctx: SecurityRuleContext
  beneficiary: SecurityBeneficiary
  document: SecurityDocument
}) {
  const {
    ctx: { user },
    beneficiary,
    document
  } = params
  return {
    create: false,
    edit: canViewOrEditDocument(user, beneficiary, document),
    view: canViewOrEditDocument(user, beneficiary, document),
    delete: canDeleteDocument(user, beneficiary),
    set: {
      confidential: canSetDocumentAsConfidential(user, beneficiary, document)
    }
  }
}

const canDeleteDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) || isReferentFor(grantee, beneficiary)

const canViewConfidentialDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  (isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
    isReferentFor(grantee, beneficiary)) &&
  isCreator(grantee, document)

const canViewNonConfidentialDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) ||
  isReferentFor(grantee, beneficiary) ||
  (isInSameStructureAs(grantee, beneficiary, ['ReceptionAgent']) &&
    isCreator(grantee, document))

const canViewOrEditDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator & { confidential: boolean }
): boolean =>
  document.confidential
    ? canViewConfidentialDocument(grantee, beneficiary, document)
    : canViewNonConfidentialDocument(grantee, beneficiary, document)

const canSetDocumentAsConfidential = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  document: SecurityTargetWithCreator
): boolean =>
  (isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
    isReferentFor(grantee, beneficiary)) &&
  isCreator(grantee, document)
