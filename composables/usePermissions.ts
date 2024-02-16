import { AppContextPermissions } from '~/server/security'

export function usePermissions() {
  const application = useState<AppContextPermissions>(
    'permissions:app',
    () => ({
      export: {
        stats: false,
        history: false,
        beneficiaries: false
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
    })
  )

  function reset() {
    application.value = {
      export: {
        stats: false,
        history: false,
        beneficiaries: false
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

  return { application, reset }
}
