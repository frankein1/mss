import { DataInclusionHandler } from '../integrations/data-inclusion/structure-import.service'
import { useScheduler } from '#scheduler'

const FREQUENCY_IN_DAYS = 15

export default defineNitroPlugin(() => {
  startScheduler()
})

function startScheduler() {
  const scheduler = useScheduler()
  scheduler
    .run(() => DataInclusionHandler.handleStructuresImport(true))
    .everyDays(FREQUENCY_IN_DAYS)
}
