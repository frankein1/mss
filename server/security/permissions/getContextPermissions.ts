import { SecurityRuleContext, SecurityRuleGrantee } from '../rules'
import { SecurityRuleStructure } from '../rules/types'
import { getGranteRole } from '../rules/helpers'

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
    helpRequest: boolean
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
      ministere: false,
      helpRequest: false
    }
  }
}

function getUserContextPermissions(
  ctx: SecurityRuleContext
): AppContextPermissions {
  const {
    manager,
    socialWorker,
    instructor,
    receptionAgent,
    referent,
    ministryAgent,
    cias,
    ccas
  } = getGranteRole(ctx)

  return {
    export: {
      history: manager || receptionAgent || instructor || socialWorker,
      beneficiaries: manager,
      stats: manager || socialWorker || referent || instructor
    },
    create: {
      user: manager,
      prescribingOrganization:
        manager || socialWorker || instructor || referent,
      instructorOrganization: manager || socialWorker || instructor || referent
    },
    edit: {
      structure: manager
    },
    module: {
      users: manager,
      stats: manager || socialWorker || instructor || referent,
      statsByReferent: manager,
      health: cias || ccas,
      ministere: ministryAgent,
      helpRequest: manager || socialWorker || instructor || referent
    }
  }
}
