import { DataInclusionIntegrationHandler } from '../integrations/data-inclusion/structure-import.service'
import { useScheduler } from '#scheduler'

const FREQUENCY_IN_DAYS = 15

export default defineNitroPlugin(() => {
  startScheduler()
})

function startScheduler() {
  const scheduler = useScheduler()
  scheduler
    .run(() => DataInclusionIntegrationHandler.handleStructuresImport(true))
    .everyDays(FREQUENCY_IN_DAYS)
}
