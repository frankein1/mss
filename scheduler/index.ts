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
import documentNotifications from './notification/create-document-notifications'
import disableInactiveStructures from './structure/disable-inactive-structures'
import importDataInclusionStructures from './data-inclusion/import-structures'

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
      await documentNotifications.createDueInAMonthDocumentNotifications()
      await documentNotifications.createDueTodayDocumentNotifications()

      // TO BE UNCOMMENTED WHEN RuntimeConfig issue is solved and when lastActivity has been migrated
      // await beneficiaryToBeArchivedNotifications.createArchiveDueRemindersNotifications()
      // await beneficiaryToBeArchivedNotifications.createArchiveDueOneMonthNotifications()
    },
    { timezone, name: 'notificationCreator' }
  )

  const at30past2am = '30 2 * * *'
  new Cron(at30past2am, disableInactiveStructures, {
    timezone,
    name: 'disableInactiveStructures'
  })

  const at5am = '0 5 * * *'
  new Cron(at5am, exportAnonymizedDatabase, {
    timezone,
    name: 'metabaseAnonymization'
  })

  const everySundayAt3am = '0 3 * * 0'
  new Cron(everySundayAt3am, importDataInclusionStructures, {
    timezone,
    name: 'dataInclusionStructureImport'
  })
}

startScheduler()
