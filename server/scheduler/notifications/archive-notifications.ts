import { createArchiveDueOneMonthNotifications } from '~~/server/services/notification/create-archive-due-one-month-notifications.service'
import * as Sentry from '@sentry/node'

const archiveDueOneMonthNotifications = async () => {
  try {
    await createArchiveDueOneMonthNotifications()
  } catch (e: unknown) {
    console.error('archiveNotifications: error during notifications archiving')
    console.error(e)
    Sentry.captureException(e)
  }
}

archiveDueOneMonthNotifications()
