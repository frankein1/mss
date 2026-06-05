import type { AppContextPermissions } from '~/server/security'

export const defaultPermissions = (): AppContextPermissions => ({
  view: {
    admin: false,
    cgu: { asManager: false }
  },
  export: {
    stats: false,
    history: false
  },
  edit: {
    structure: false,
    health: { nir: false },
    beneficiary: { referent: false }
  },
  archive: {
    beneficiary: false
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
    budget: false,
    rdv: false
  },
  workshop: {
    duplicateParticipants: false
  }
})

export function usePermissions() {
  const application = useState<AppContextPermissions>(
    'permissions:app',
    defaultPermissions
  )

  function reset() {
    application.value = defaultPermissions()
  }

  return { application, reset }
}
