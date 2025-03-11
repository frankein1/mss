import { useScheduler } from '#scheduler'
import { deleteArchivedNames } from '~/utils/archiveBeneficiary/deleteArchivedNames'

export default defineNitroPlugin(() => {
  startScheduler()
})

function startScheduler() {
  const scheduler = useScheduler()
  scheduler
    .run(async () => {
      await deleteArchivedNames()
    })
    .dailyAt(1, 0)
}
