import { BrevoIntegrationService } from '~/server/integrations/brevo'

export function launchBrevoExport() {
  return BrevoIntegrationService.exportContacts()
}
