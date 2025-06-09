import { SecurityRuleContext, SecurityRuleGrantee } from '../rules'
import { SecurityRuleStructure } from '../rules/types'
import { getGranteRole } from '../rules/helpers'
import { StructureRepo } from '~/server/database'

export type AppContextPermissions = {
  export: {
    stats: boolean
    history: boolean
  }
  edit: {
    structure: boolean
    health: {
      nir: boolean
    }
  }
  module: {
    users: boolean
    stats: boolean
    statsByReferent: boolean
    health: boolean
    ministere: boolean
    helpRequest: boolean
    partner: boolean
    vulnerablePerson: boolean
    budget: boolean
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
      stats: false
    },
    edit: {
      structure: true,
      health: {
        nir: false
      }
    },
    module: {
      users: false,
      stats: false,
      statsByReferent: false,
      health: false,
      ministere: false,
      helpRequest: false,
      partner: false,
      vulnerablePerson: false,
      budget: false
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

  return {
    export: {
      history: manager || socialWorker || referent || instructor,
      stats: ministryAgent
        ? manager || referent
        : manager || socialWorker || instructor || referent
    },
    edit: {
      structure: manager,
      health: {
        nir: cias || ccas || city
      }
    },
    module: {
      users: manager,
      stats: ministryAgent
        ? manager || referent
        : manager || socialWorker || instructor || referent,
      statsByReferent: socialWorker || manager,
      health: true,
      ministere: ministryAgent,
      helpRequest: manager || socialWorker || instructor || referent,
      partner: manager || socialWorker,
      vulnerablePerson: !ngo && !ministryAgent,
      budget: !receptionAgent
    }
  }
}

export type IntegrationContextPermissions = {
  rdv: boolean
}

export async function getIntegrationContextPermissions({
  user,
  structure
}: {
  user: SecurityRuleGrantee
  structure: SecurityRuleStructure | null | undefined
}): Promise<IntegrationContextPermissions> {
  if (structure && user.role !== 'Administrator') {
    const s = await StructureRepo.findUniqueOrThrow(user, {
      where: { id: structure.id },
      select: { externalRdvspActive: true }
    })
    return { rdv: s.externalRdvspActive || false }
  }

  return { rdv: false }
}
