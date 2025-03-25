import { useScheduler } from '#scheduler'
import { deleteArchivedNames } from '~/server/services/notification/delete-archive-names.service'

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
