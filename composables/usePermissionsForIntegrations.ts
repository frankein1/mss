import type { IntegrationContextPermissions } from '~/server/security'

export function usePermissionsForIntegrations() {
  const integrations = useState<IntegrationContextPermissions>(
    'permissions:integrations',
    () => ({ rdv: false })
  )

  const trpcClient = useTrpcClient()

  callOnce(() => {
    trpcClient.permissions.getIntegrationsPermissions.query().then(p => {
      integrations.value = p
    })
  })

  return { integrations }
}
