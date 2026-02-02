import { createArchiveDueRemindersNotifications } from '~/server/services/notification/create-archive-reminders-notifications.service'

const archiveRemindersNotifications = async () => {
  try {
    await createArchiveDueRemindersNotifications()
  } catch (e: unknown) {
    console.error('archiveNotifications: error during notifications archiving')
    console.error(e)
    throw e
  }
}

archiveRemindersNotifications()
