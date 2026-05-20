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

export const jobs = {
  queuedEmailSender: sendQueuedEmails,

  emailCreator: async () => {
    await sendMailsForInactiveStructures()
    await sendEmailsForAccountReminder()
  },

  anonymizer: async () => {
    await anonymizeArchivedBeneficiaries()
    await anonymizeExternalAttendees()
    await cleanupUserActivities()
  },

  disableInactiveStructures,

  notificationCreator: async () => {
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

  metabaseAnonymization: exportAnonymizedDatabase,

  dataInclusionStructureImport: importDataInclusionStructures
} satisfies Record<string, () => Promise<unknown>>

export type JobName = keyof typeof jobs
