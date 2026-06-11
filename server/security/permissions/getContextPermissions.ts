import type { SecurityRuleContext, SecurityRuleGrantee } from '../rules'
import type { SecurityRuleStructure } from '../rules/types'
import { getGranteRole } from '../rules/helpers'

export type AppContextPermissions = {
  structure: {
    edit: boolean
    ministryFields: boolean
  }
  user: {
    manage: boolean
  }
  stats: {
    view: boolean
    viewByReferent: boolean
    export: boolean
  }
  history: {
    export: boolean
  }
  beneficiary: {
    /** Can archive regardless of beneficiary inactivity status */
    archiveBeforeDelay: boolean
    viewVulnerablePerson: boolean
    health: {
      editNir: boolean
    }
  }
  helpRequest: {
    access: boolean
  }
  budget: {
    access: boolean
  }
  partner: {
    access: boolean
  }
  rdv: {
    access: boolean
  }
  workshop: {
    duplicateAttendees: boolean
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
    structure: {
      edit: true,
      ministryFields: false
    },
    user: {
      manage: false
    },
    stats: {
      view: false,
      viewByReferent: false,
      export: false
    },
    history: {
      export: false
    },
    beneficiary: {
      archiveBeforeDelay: false,
      viewVulnerablePerson: false,
      health: {
        editNir: false
      }
    },
    helpRequest: {
      access: false
    },
    budget: {
      access: false
    },
    partner: {
      access: false
    },
    rdv: {
      access: false
    },
    workshop: {
      duplicateAttendees: false
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
    receptionAgent,
    ngo,
    cias,
    ccas,
    city
  } = getGranteRole(ctx)
  const hasRdvAccess = ctx.structure.externalRdvspActive || false

  return {
    structure: {
      edit: manager,
      ministryFields: ministryAgent
    },
    user: {
      manage: manager
    },
    stats: {
      view: ministryAgent
        ? manager || referent
        : manager || socialWorker || instructor || referent,
      viewByReferent: socialWorker || manager,
      export: ministryAgent
        ? manager || referent
        : manager || socialWorker || instructor || referent
    },
    history: {
      export: manager || socialWorker || referent || instructor
    },
    beneficiary: {
      archiveBeforeDelay: manager,
      viewVulnerablePerson: !ngo && !ministryAgent,
      health: {
        editNir: cias || ccas || city
      }
    },
    helpRequest: {
      access: manager || socialWorker || instructor || referent
    },
    budget: {
      access: !receptionAgent
    },
    partner: {
      access: manager || socialWorker
    },
    rdv: {
      access: hasRdvAccess
    },
    workshop: {
      duplicateAttendees: !referent
    }
  }
}
