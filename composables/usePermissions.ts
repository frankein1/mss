import type { AppContextPermissions } from '~/server/security'

export function usePermissions() {
  const application = useState<AppContextPermissions>(
    'permissions:app',
    () => ({
      structure: {
        edit: false,
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
    })
  )

  function reset() {
    application.value = {
      structure: {
        edit: false,
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

  return { application, reset }
}
