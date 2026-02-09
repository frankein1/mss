import { test, describe, expect } from 'vitest'
import type {
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import { getFileInstructionPermissions } from './getFileInstructionPermissions'
import {
  FixtureStructure,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { getAppContextPermissions } from './getContextPermissions'
import { AllowSecurityCheck } from '../rules/types'
import { getDocumentPermissions } from './getDocumentPermissions'

const structureId = fixtureStructures[FixtureStructure.Test].id

const structure = {
  id: structureId,
  type: 'Ccas',
  externalRdvspActive: null
} as const

const structureManager = {
  id: fixturesUsers[FixtureUserRole.StructureManager].id,
  role: 'StructureManager',
  status: 'Active',
  structureId
} satisfies SecurityRuleContext['user']

const socialWorker = {
  id: fixturesUsers[FixtureUserRole.SocialWorker].id,
  role: 'SocialWorker',
  status: 'Active',
  structureId
} satisfies SecurityRuleContext['user']

const instructor = {
  id: fixturesUsers[FixtureUserRole.Instructor].id,
  role: 'Instructor',
  status: 'Active',
  structureId
} satisfies SecurityRuleContext['user']

const receptionAgent = {
  id: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
  role: 'ReceptionAgent',
  status: 'Active',
  structureId
} satisfies SecurityRuleContext['user']

const referent = {
  id: fixturesUsers[FixtureUserRole.Referent].id,
  role: 'Referent',
  status: 'Active',
  structureId
} satisfies SecurityRuleContext['user']

const familyFile = {
  structureId,
  referents: [
    { id: structureManager.id },
    { id: instructor.id },
    { id: referent.id }
  ]
} satisfies SecurityTargetWithReferents & SecurityTargetWithStructure

const familyFileNotReferent = {
  structureId,
  referents: [{ id: structureManager.id }]
} satisfies SecurityTargetWithReferents & SecurityTargetWithStructure

/** App Context */
const appContextPermissions = {
  structureManager: getAppContextPermissions({
    user: structureManager,
    structure
  }),
  socialWorker: getAppContextPermissions({
    user: socialWorker,
    structure
  }),
  instructor: getAppContextPermissions({
    user: instructor,
    structure
  }),
  receptionAgent: getAppContextPermissions({
    user: receptionAgent,
    structure
  }),
  referent: getAppContextPermissions({
    user: referent,
    structure
  })
}

/** Documents */
const document = {
  createdById: structureManager.id,
  confidential: false
}

const documentPermissions = {
  structureManager: getDocumentPermissions({
    ctx: { user: structureManager, structure },
    familyFile,
    document
  }),
  socialWorker: getDocumentPermissions({
    ctx: { user: socialWorker, structure },
    familyFile,
    document
  }),
  instructor: getDocumentPermissions({
    ctx: { user: instructor, structure },
    familyFile,
    document
  }),
  receptionAgent: getDocumentPermissions({
    ctx: { user: receptionAgent, structure },
    familyFile,
    document
  }),
  receptionAgentCreatorOfDocument: getDocumentPermissions({
    ctx: { user: receptionAgent, structure },
    familyFile,
    document: { ...document, createdById: receptionAgent.id }
  }),
  referent: getDocumentPermissions({
    ctx: { user: referent, structure },
    familyFile,
    document
  }),
  referentNotMemberOfFileReferents: getDocumentPermissions({
    ctx: { user: referent, structure },
    familyFile: familyFileNotReferent,
    document
  })
}

const documentConfidentialPermissions = {
  structureManager: getDocumentPermissions({
    ctx: { user: structureManager, structure },
    familyFile,
    document: { createdById: structureManager.id, confidential: true }
  }),
  structureManagerNotCreatorOfDocument: getDocumentPermissions({
    ctx: { user: structureManager, structure },
    familyFile,
    document: { createdById: receptionAgent.id, confidential: true }
  }),
  socialWorker: getDocumentPermissions({
    ctx: { user: socialWorker, structure },
    familyFile,
    document: { createdById: socialWorker.id, confidential: true }
  }),
  socialWorkerNotCreatorOfDocument: getDocumentPermissions({
    ctx: { user: socialWorker, structure },
    familyFile,
    document: { createdById: socialWorker.id, confidential: true }
  }),
  instructor: getDocumentPermissions({
    ctx: { user: instructor, structure },
    familyFile,
    document: { createdById: instructor.id, confidential: true }
  }),
  instructorNotCreatorOfDocument: getDocumentPermissions({
    ctx: { user: instructor, structure },
    familyFile,
    document: { createdById: receptionAgent.id, confidential: true }
  }),
  receptionAgent: getDocumentPermissions({
    ctx: { user: receptionAgent, structure },
    familyFile,
    document: { createdById: receptionAgent.id, confidential: true }
  }),
  receptionAgentNotCreatorOfDocument: getDocumentPermissions({
    ctx: { user: receptionAgent, structure },
    familyFile,
    document: { createdById: structureManager.id, confidential: true }
  }),
  referent: getDocumentPermissions({
    ctx: { user: referent, structure },
    familyFile,
    document: { createdById: referent.id, confidential: true }
  }),
  referentNotCreatorOfDocument: getDocumentPermissions({
    ctx: { user: referent, structure },
    familyFile,
    document: { createdById: receptionAgent.id, confidential: true }
  })
}

const EACH = {
  'Structure Manager can create and deactivate a user': {
    fn: () => appContextPermissions.structureManager.module.users,
    expected: true
  },
  'Social Worker cannot create and deactivate a user': {
    fn: () => appContextPermissions.socialWorker.module.users,
    expected: false
  },
  'Instructor cannot create and deactivate a user': {
    fn: () => appContextPermissions.instructor.module.users,
    expected: false
  },
  'Reception Agent cannot create and deactivate a user': {
    fn: () => appContextPermissions.receptionAgent.module.users,
    expected: false
  },
  'Referent cannot create and deactivate a user': {
    fn: () => appContextPermissions.referent.module.users,
    expected: false
  },
  'Structure Manager can access the user list': {
    fn: () => appContextPermissions.structureManager.module.users,
    expected: true
  },
  'Social Worker cannot access the user list': {
    fn: () => appContextPermissions.socialWorker.module.users,
    expected: false
  },
  'Instructor cannot access the user list': {
    fn: () => appContextPermissions.instructor.module.users,
    expected: false
  },
  'Reception Agent cannot access the user list': {
    fn: () => appContextPermissions.receptionAgent.module.users,
    expected: false
  },
  'Referent cannot access the user list': {
    fn: () => appContextPermissions.referent.module.users,
    expected: false
  },
  'Structure Manager can change a user’s role': {
    fn: () => appContextPermissions.structureManager.module.users,
    expected: true
  },
  'Social Worker cannot change a user’s role': {
    fn: () => appContextPermissions.socialWorker.module.users,
    expected: false
  },
  'Instructor cannot change a user’s role': {
    fn: () => appContextPermissions.instructor.module.users,
    expected: false
  },
  'Reception Agent cannot change a user’s role': {
    fn: () => appContextPermissions.receptionAgent.module.users,
    expected: false
  },
  'Referent cannot change a user’s role': {
    fn: () => appContextPermissions.referent.module.users,
    expected: false
  },
  'Structure Manager can customize the structure': {
    fn: () => appContextPermissions.structureManager.edit.structure,
    expected: true
  },
  'Social Worker cannot customize the structure': {
    fn: () => appContextPermissions.socialWorker.edit.structure,
    expected: false
  },
  'Instructor cannot customize the structure': {
    fn: () => appContextPermissions.instructor.edit.structure,
    expected: false
  },
  'Reception Agent cannot customize the structure': {
    fn: () => appContextPermissions.receptionAgent.edit.structure,
    expected: false
  },
  'Referent cannot customize the structure': {
    fn: () => appContextPermissions.referent.edit.structure,
    expected: false
  },
  'Structure Manager can view information about the structure and social support subjects':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Social Worker can view information about the structure and social support subjects':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Instructor can view information about the structure and social support subjects':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Reception Agent can view information about the structure and social support subjects':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Referent can view information about the structure and social support subjects':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Structure Manager can access the beneficiary database': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Social Worker can access the beneficiary database': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Instructor can access the beneficiary database': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Reception Agent can access the beneficiary database': {
    fn: AllowSecurityCheck,
    expected: true
  },
  // The filter on beneficiaries is implemented at the BeneficiaryConstraint Level
  'Referent can access the beneficiary database only for * les dossiers dont il est référent':
    {
      fn: AllowSecurityCheck,
      expected: true
    },
  'Structure Manager can create a beneficiary record': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Social Worker can create a beneficiary record': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Instructor can create a beneficiary record': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Reception Agent can create a beneficiary record': {
    fn: AllowSecurityCheck,
    expected: true
  },
  'Referent can create a beneficiary record': {
    fn: AllowSecurityCheck,
    expected: true
  },
  // FIXME Should be decomposed in beneficiary form sections and health fields
  // Integration test because depends on the beneficiary & structure
  'Structure Manager can view and modify a beneficiary record': {},
  'Social Worker can view and modify a beneficiary record': {},
  'Instructor can view and modify a beneficiary record': {},
  'Reception Agent can view and modify a beneficiary record * informations générales':
    {},
  "Referent can view and modify a beneficiary record only * s'il est référent":
    {},
  'Structure Manager can delete a beneficiary record': {},
  'Social Worker can delete a beneficiary record': {},
  'Instructor cannot delete a beneficiary record': {},
  'Reception Agent cannot delete a beneficiary record': {},
  'Referent cannot delete a beneficiary record': {},
  // FIXME Integration test because depends on the beneficiary last activity
  // get-archive-permissions.query.spec.ts
  'Structure Manager can archive files (download and delete)': {},
  "Social Worker can archive files * Uniquement s'il est référent * Uniquement à 2 ans d’inactivité du dossier":
    {},
  "Instructor can archive files * Uniquement s'il est référent * Uniquement à 2 ans d’inactivité du dossier":
    {},
  'Reception Agent cannot archive files': {},
  "Referent can archive files * Uniquement s'il est référent * Uniquement à 2 ans d’inactivité du dossier":
    {},
  //  FIXME no permissions on this feature
  'Structure Manager can assign or remove a referent agent on a beneficiary record':
    {},
  'Social Worker can assign or remove a referent agent on a beneficiary record':
    {},
  'Instructor can assign or remove a referent agent on a beneficiary record':
    {},
  'Reception Agent cannot assign or remove a referent agent on a beneficiary record':
    {},
  "Referent can assign or remove a referent agent on a beneficiary record only * s'il est référent":
    {},
  // FIXME can only be tested through route
  'Structure Manager can export the beneficiary database': {},
  'Social Worker can export * Uniquement les coordonnées et situation familiale':
    {},
  'Instructor can export * Uniquement les coordonnées et situation familiale':
    {},
  'Reception Agent can export * Uniquement les coordonnées et situation familiale':
    {},
  'Referent can export * Uniquement les coordonnées et situation familiale': {},

  'Structure Manager can add documents': {
    fn: () => documentPermissions.structureManager.add,
    expected: true
  },
  'Social Worker can add documents': {
    fn: () => documentPermissions.socialWorker.add,
    expected: true
  },
  'Instructor can add documents': {
    fn: () => documentPermissions.instructor.add,
    expected: true
  },
  'Reception Agent can add documents': {
    fn: () => documentPermissions.receptionAgent.add,
    expected: true
  },
  "Referent can add documents * s'il est référent du dossier": {
    fn: () => documentPermissions.referent.add,
    expected: true
  },
  "Referent cannot add documents * s'il n'est pas est référent du dossier": {
    fn: () => documentPermissions.referentNotMemberOfFileReferents.add,
    expected: false
  },
  'Structure Manager can view and modify documents': {
    fn: () => documentPermissions.structureManager.view,
    expected: true
  },
  'Social Worker can view and modify documents': {
    fn: () => documentPermissions.socialWorker.view,
    expected: true
  },
  'Instructor can view and modify documents': {
    fn: () => documentPermissions.instructor.view,
    expected: true
  },
  'Reception Agent can view and modify documents * ajoutés par lui': {
    fn: () => documentPermissions.receptionAgentCreatorOfDocument.view,
    expected: true
  },
  'Reception Agent cannot view and modify documents * non ajoutés par lui': {
    fn: () => documentPermissions.receptionAgent.view,
    expected: false
  },
  "Referent can view and modify documents * s'il est référent du dossier": {
    fn: () => documentPermissions.referent.view,
    expected: true
  },
  "Referent cannot view and modify documents * s'il est n'est pas référent du dossier":
    {
      fn: () => documentPermissions.referentNotMemberOfFileReferents.view,
      expected: false
    },
  'Structure Manager can view and modify confidential documents * ajoutés par lui':
    {
      fn: () => documentConfidentialPermissions.structureManager.view,
      expect: true
    },
  'Structure Manager cannot view and modify confidential documents * non ajoutés par lui':
    {
      fn: () =>
        documentConfidentialPermissions.structureManagerNotCreatorOfDocument
          .view,
      expect: false
    },
  'Social Worker can view and modify confidential documents * ajoutés par lui':
    {
      fn: () => documentConfidentialPermissions.socialWorker.view,
      expect: true
    },
  'Social Worker cannot view and modify confidential documents * non si ajoutés par lui':
    {
      fn: () =>
        documentConfidentialPermissions.socialWorkerNotCreatorOfDocument.view,
      expect: false
    },
  'Instructor can view and modify confidential documents * ajoutés par lui': {
    fn: () => documentConfidentialPermissions.instructor.view,
    expect: true
  },
  'Instructor cannot view and modify confidential documents * non ajoutés par lui':
    {
      fn: () =>
        documentConfidentialPermissions.instructorNotCreatorOfDocument.view,
      expect: false
    },
  'Reception Agent can view and modify confidential documents * ajoutés par lui':
    {
      fn: () => documentConfidentialPermissions.receptionAgent.view,
      expect: true
    },
  'Reception Agent cannot view and modify confidential documents * non ajoutés par lui':
    {
      fn: () =>
        documentConfidentialPermissions.receptionAgentNotCreatorOfDocument.view,
      expect: false
    },
  'Referent can view and modify confidential documents * ajoutés par lui': {
    fn: () => documentConfidentialPermissions.referent.view,
    expect: true
  },
  'Referent cannot view and modify confidential documents * non ajoutés par lui':
    {
      fn: () =>
        documentConfidentialPermissions.referentNotCreatorOfDocument.view,
      expect: false
    },
  'Structure Manager can delete a document': {},
  'Social Worker can delete a document': {},
  'Instructor cannot delete a document': {},
  'Reception Agent cannot delete a document': {},
  "Referent can delete a document only * s'il est référent": {},
  'Structure Manager can create a followup': {},
  'Social Worker can create a followup': {},
  'Instructor can create a followup': {},
  'Reception Agent can create a followup': {},
  "Referent can create a followup only * s'il est référent": {},
  'Structure Manager can preview a followup': {},
  'Social Worker can preview a followup': {},
  'Instructor can preview a followup': {},
  'Reception Agent can preview a followup': {},
  "Referent can preview a followup only * s'il est référent": {},
  'Structure Manager can inspect a followup details': {},
  'Social Worker can inspect a followup details': {},
  'Instructor can inspect a folloup details only * si créée par lui': {},
  'Reception Agent can inspect a followup details only * si créée par lui': {},
  "Referent can inspect a followup details only * s'il est référent": {},
  'Structure Manager can modify a followup': {},
  "Social Worker can modify a followup only * s'il est référent ou créateur":
    {},
  'Instructor can modify a followup only * si créée par lui': {},
  'Reception Agent can modify a followup only * si créée par lui': {},
  "Referent can modify a followup only * s'il est référent ou créateur": {},
  'Structure Manager can add comments to a followup': {},
  'Social Worker can add comments to a followup': {},
  'Instructor can add comments to a followup': {},
  'Reception Agent can add comments to a followup': {},
  "Referent can add comments to a followup only * s'il est référent": {},
  'Structure Manager can view comments on a followup': {},
  'Social Worker can view comments on a followup': {},
  'Instructor can view comments on a followup': {},
  'Reception Agent can view comments on a followup': {},
  "Referent can view comments on a followup only * s'il est référent": {},
  'Structure Manager can delete a followup': {},
  'Social Worker can delete a followup only * si créée par lui': {},
  'Instructor can delete a followup only * si créée par lui': {},
  'Reception Agent can delete a followup only * si créée par lui': {},
  "Referent can delete a followup only * s'il est référent": {},
  'Structure Manager can print a followup': {},
  'Social Worker can print a followup': {},
  'Instructor can print a followup only * si créée par lui': {},
  'Reception Agent can print a followup only * si créée par lui': {},
  "Referent can print a followup only * s'il est référent": {},
  'Structure Manager can create a file instruction': {},
  'Social Worker can create a file instruction': {},
  'Instructor can create a file instruction': {},
  'Reception Agent cannot create a file instruction': {},
  "Referent can create a file instruction only * s'il est référent": {},
  'Structure Manager can preview a file instruction': {},
  'Social Worker can preview a file instruction': {},
  'Instructor can preview a file instruction': {},
  'Reception Agent can preview a file instruction': {},
  "Referent can preview a file instruction only * s'il est référent": {},
  'Structure Manager can view a file instruction details': {},
  'Social Worker can view a file instruction details': {},
  'Instructor can view a file instruction details only * si créée par lui': {},
  'Reception Agent cannot view a file instruction details': {},
  "Referent can view a file instruction details only * s'il est référent": {},
  'Structure Manager can modify a file instruction': {},
  "Social Worker can modify a file instruction only * s'il est référent ou créateur":
    {},
  'Instructor can modify a file instruction only * si créée par lui': {},
  'Reception Agent cannot modify a file instruction': {},
  "Referent can modify a file instruction only * s'il est référent ou créateur":
    {},
  'Structure Manager can add comments to a file instruction': {},
  'Social Worker can add comments to a file instruction': {},
  'Instructor can add comments to a file instruction': {},
  'Reception Agent can add comments to a file instruction': {},
  "Referent can add comments to a file instruction only * s'il est référent":
    {},
  'Structure Manager can view comments on a file instruction': {},
  'Social Worker can view comments on a file instruction': {},
  'Instructor can view comments on a file instruction': {},
  'Reception Agent can view comments on a file instruction': {},
  "Referent can view comments on a file instruction only * s'il est référent":
    {},
  'Structure Manager can delete a file instruction': {},
  'Social Worker can delete a file instruction only * si créée par lui': {},
  'Instructor can delete a file instruction only * si créée par lui': {},
  'Reception Agent cannot delete a file instruction': {},
  "Referent can delete a file instruction only * s'il est référent": {},
  'Structure Manager can print a file instruction': {},
  'Social Worker can print a file instruction': {},
  'Instructor can print a file instruction only * si créée par lui': {},
  'Reception Agent cannot print a file instruction': {},
  "Referent can print a file instruction only * s'il est référent": {},
  'Structure Manager can access the social rights simulator': {},
  'Social Worker can access the social rights simulator': {},
  'Instructor can access the social rights simulator': {},
  'Reception Agent can access the social rights simulator': {},
  'Referent can access the social rights simulator': {},
  'Structure Manager can access the social support page': {},
  'Social Worker can access the social support page': {},
  'Instructor can access the social support page': {},
  'Reception Agent can access the social support page': {},
  'Referent can access can access the social support page only for * les dossiers dont il est référent':
    {},
  'Structure Manager can export the social support table': {},
  'Social Worker can export the social support table': {},
  'Instructor can export the social support table': {},
  'Reception Agent cannot export the social support table': {},
  'Referent can export the social support table only for * les dossiers dont il est référent':
    {},
  'Structure Manager can view statistics': {},
  'Social Worker can view statistics': {},
  'Instructor can view statistics': {},
  'Reception Agent cannot view statistics': {},
  'Referent can view statistics only for * les dossiers dont il est référent':
    {},
  'Structure Manager can export statistics': {},
  'Social Worker can export statistics': {},
  'Instructor can export statistics': {},
  'Reception Agent cannot export statistics': {},
  'Referent can export statistics only for * les dossiers dont il est référent':
    {},
  'Structure Manager can create and delete a partner organization in the partners directory':
    {},
  'Social Worker can create and delete a partner organization in the partners directory':
    {},
  'Instructor cannot create and delete a partner organization in the partners directory':
    {},
  'Reception Agent cannot create and delete a partner organization in the partners directory':
    {},
  'Referent cannot create and delete a partner organization in the partners directory':
    {},
  'Structure Manager can view and edit a partner organization': {},
  'Social Worker can view and edit a partner organization': {},
  'Instructor can view and edit a partner organization': {},
  'Reception Agent can view and edit a partner organization': {},
  'Referent can view and edit a partner organization': {},
  'Structure Manager can access the budget module': {},
  'Social Worker can access the budget module': {},
  'Instructor can access the budget module': {},
  'Reception Agent cannot access the budget module': {},
  'Referent can access the budget module only for * les dossiers dont il est référent':
    {}
}
