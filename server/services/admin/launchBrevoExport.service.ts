import { BrevoIntegrationService } from '~/server/integrations/brevo'

export function launchBrevoExport(all: boolean) {
  return BrevoIntegrationService.exportContacts(all)
}
