import { SecurityRuleContext, SecurityRuleGrantee } from '../rules'
import { SecurityRuleStructure } from '../rules/types'
import { getGranteRole } from '../rules/helpers'

export type AppContextPermissions = {
  export: {
    stats: boolean
    history: boolean
    beneficiaries: boolean
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
    partner: boolean
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
    edit: {
      structure: false
    },
    module: {
      users: false,
      stats: false,
      statsByReferent: false,
      health: false,
      ministere: false,
      helpRequest: false,
      partner: false
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
    referent,
    ministryAgent,
    cias,
    ccas
  } = getGranteRole(ctx)

  return {
    export: {
      history: manager || socialWorker || referent || instructor,
      beneficiaries: manager,
      stats: manager || socialWorker || referent || instructor
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
      helpRequest: manager || socialWorker || instructor || referent,
      partner: manager || socialWorker
    }
  }
}
