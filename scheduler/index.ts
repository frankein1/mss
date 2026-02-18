import { Cron } from 'croner'
import { initSentry, terminateSentry } from './utils'
import anonymizeExternalAttendees from './workshop/anonymize-external-attendees'
import exportAnonymizedDatabase from './db-anonymizer'
import cleanupUserActivities from './user-activity/cleanup-user-activities'
import sendQueuedEmails from './email/send-queued-emails'
import sendMailsForInactiveStructures from './email/create-emails-for-inactive-structures'
import sendEmailsForAccountReminder from './email/create-emails-for-account-reminder'
import anonymizeArchivedBeneficiaries from './archived-beneficiary/anonymize-archived-beneficiary'
import socialSupportNotifications from './notification/create-social-support-notifications'

const timezone = 'Europe/Paris'

function startScheduler() {
  console.log(`[scheduler]: [${new Date().toISOString()}]: starting crons`)

  initSentry()

  const every30seconds = '*/30 * * * * *'
  new Cron(every30seconds, sendQueuedEmails, {
    timezone,
    name: 'queuedEmailSender'
  })

  const at23pm = '0 23 * * *'
  new Cron(
    at23pm,
    async () => {
      await sendMailsForInactiveStructures()
      await sendEmailsForAccountReminder()
    },
    { timezone, name: 'emailCreator' }
  )

  const atMidnight = '0 0 * * *'
  new Cron(
    atMidnight,
    async () => {
      await anonymizeArchivedBeneficiaries()
      await anonymizeExternalAttendees()
      await cleanupUserActivities()
    },
    { timezone, name: 'anonymizer' }
  )

  const at1am = '0 1 * * *'
  new Cron(
    at1am,
    async () => {
      await socialSupportNotifications.createDueInAMonthSocialSupportNotifications()
      await socialSupportNotifications.createDueTodaySocialSupportNotifications()
      await socialSupportNotifications.createEndOfSupportTodayHelpRequestNotifications()
      await socialSupportNotifications.createEndOfSupportInAMonthHelpRequestNotifications()

      // TO BE UNCOMMENTED WHEN RuntimeConfig issue is solved and when lastActivity has been migrated
      // await beneficiaryToBeArchivedNotifications.createArchiveDueRemindersNotifications()
      // await beneficiaryToBeArchivedNotifications.createArchiveDueOneMonthNotifications()
    },
    { timezone, name: 'notificationCreator' }
  )

  const at5am = '0 5 * * *'
  new Cron(at5am, exportAnonymizedDatabase, {
    timezone,
    name: 'metabaseAnonymization'
  })
}

startScheduler()
;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await terminateSentry()
    process.exit(1)
  })
)
