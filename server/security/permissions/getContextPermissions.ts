import { StructureType } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityRuleGrantee,
  hasAllowedRole
} from '../rules'
import { SecurityRuleStructure } from '../rules/types'

export type AppContextPermissions = {
  export: {
    stats: boolean
    history: boolean
    beneficiaries: boolean
  }
  create: {
    user: boolean
    prescribingOrganization: boolean
    instructorOrganization: boolean
  }
  edit: {
    structure: boolean
  }
  module: {
    users: boolean
    stats: boolean
    statsByReferent: boolean
    health: boolean
    ministere: boolean
  }
  helpRequest: {
    get: {
      anyDueDate: boolean
      anyAllocatedAmount: boolean
      anyPaymentMethod: boolean
      anyPaymentDate: boolean
      anyHandlingDate: boolean
      anyInstructorOrganization: boolean
      anyExaminationDate: boolean
      anyAskedAmount: boolean
    }
  }
}

export function getAppContextPermissions({
  user,
  structure
}: {
  user: SecurityRuleGrantee
  structure: SecurityRuleStructure | null | undefined
}) {
  if (structure && user.role !== 'Administrator') {
    return getUserContextPermissions({ user, structure })
  }
  return getAdminContextPermissions()
}

function getAdminContextPermissions(): AppContextPermissions {
  return {
    export: {
      history: false,
      beneficiaries: false,
      stats: false
    },
    create: {
      user: false,
      prescribingOrganization: false,
      instructorOrganization: false
    },
    edit: {
      structure: false
    },
    module: {
      users: false,
      stats: false,
      statsByReferent: false,
      health: false,
      ministere: false
    },
    helpRequest: {
      get: {
        anyDueDate: false,
        anyAllocatedAmount: false,
        anyPaymentMethod: false,
        anyPaymentDate: false,
        anyHandlingDate: false,
        anyInstructorOrganization: false,
        anyExaminationDate: false,
        anyAskedAmount: false
      }
    }
  }
}

function getUserContextPermissions(
  ctx: SecurityRuleContext
): AppContextPermissions {
  const getAnyDataOfAny = accessAnyDataOfAny(ctx.user)
  const isMinistryAgent = ctx.structure.type === StructureType.Ministere
  return {
    export: {
      history: canExportHistory(ctx.user),
      beneficiaries: canExportBeneficiaries(ctx.user),
      stats: canExportStats(ctx.user)
    },
    create: {
      user: canCreateUser(ctx.user),
      prescribingOrganization: canCreatePrescribingOrganization(ctx.user),
      instructorOrganization: canCreateInstructorOrganization(ctx.user)
    },
    edit: {
      structure: canEditStructure(ctx.user)
    },
    module: {
      users: canListUsers(ctx.user),
      stats: canViewStats(ctx.user),
      statsByReferent: canViewStatsByReferent(ctx.user),
      health: canViewHealthInfo(ctx.structure.type),
      ministere: isMinistryAgent
    },
    helpRequest: {
      get: {
        anyDueDate: getAnyDataOfAny,
        anyAllocatedAmount: getAnyDataOfAny,
        anyPaymentMethod: getAnyDataOfAny,
        anyPaymentDate: getAnyDataOfAny,
        anyHandlingDate: getAnyDataOfAny,
        anyInstructorOrganization: getAnyDataOfAny,
        anyExaminationDate: getAnyDataOfAny,
        anyAskedAmount: getAnyDataOfAny
      }
    }
  }
}

const accessAnyDataOfAny = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

const canViewHealthInfo = (structureType: StructureType): boolean => {
  return (
    structureType !== StructureType.Ccas && structureType !== StructureType.Cias
  )
}

const canCreateUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

const canCreatePrescribingOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

const canCreateInstructorOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

const canEditStructure = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

const canViewStats = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

const canViewStatsByReferent = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

const canExportHistory = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'Referent',
    'Instructor',
    'SocialWorker'
  ])

const canExportBeneficiaries = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

const canExportStats = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Referent',
    'Instructor'
  ])
