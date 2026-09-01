import anonymizeExternalAttendees from './workshop/anonymize-external-attendees'
import exportAnonymizedDatabase from './db-anonymizer'
import cleanupUserActivities from './user-activity/cleanup-user-activities'
import sendQueuedEmails from './email/send-queued-emails'
import sendMailsForInactiveStructures from './email/create-emails-for-inactive-structures'
import sendEmailsForAccountReminder from './email/create-emails-for-account-reminder'
import anonymizeArchivedBeneficiaries from './archived-beneficiary/anonymize-archived-beneficiary'
import socialSupportNotifications from './notification/create-social-support-notifications'
import documentNotifications from './notification/create-document-notifications'
import supportProgramNotifications from './notification/create-support-program-notifications'
import disableInactiveStructures from './structure/disable-inactive-structures'
import importDataInclusionStructures from './data-inclusion/import-structures'
import importDataEducationSchools from './data-education/import-schools'
import { rotateKeyEncryptionKey } from './document/rotate-key-encryption-key'

export const jobs = {
  /** Sends emails from the queue.
   * Runs every 30 seconds */
  queuedEmailSender: sendQueuedEmails,

  /** Sends reminder emails for inactive structures and account expiration.
   * Runs daily at 23:00 */
  emailCreator: async () => {
    await sendMailsForInactiveStructures()
    await sendEmailsForAccountReminder()
  },

  /** Anonymizes archived beneficiaries, external attendees and cleanup old user activities.
   * Runs daily at midnight */
  anonymizer: async () => {
    await anonymizeArchivedBeneficiaries()
    await anonymizeExternalAttendees()
    await cleanupUserActivities()
  },

  /** Disables structures inactive for more than 6 months with fewer than 10 beneficiaries.
   * Runs daily at 02:30 */
  disableInactiveStructures,

  /** Creates notifications for social support due dates (today / in 1 month), help request end-of-support (today / in 1 month), document expirations (today / in 1 month), and support program end dates (today / in 60 days).
   * Runs daily at 03:00 */
  notificationCreator: async () => {
    await socialSupportNotifications.createDueInAMonthSocialSupportNotifications()
    await socialSupportNotifications.createDueTodaySocialSupportNotifications()
    await socialSupportNotifications.createEndOfSupportTodayHelpRequestNotifications()
    await socialSupportNotifications.createEndOfSupportInAMonthHelpRequestNotifications()
    await documentNotifications.createDueInAMonthDocumentNotifications()
    await documentNotifications.createDueTodayDocumentNotifications()
    await supportProgramNotifications.createEndInSixtyDaysSupportProgramNotifications()
    await supportProgramNotifications.createEndTodaySupportProgramNotifications()

    // TO BE UNCOMMENTED WHEN RuntimeConfig issue is solved and when lastActivity has been migrated
    // await beneficiaryToBeArchivedNotifications.createArchiveDueRemindersNotifications()
    // await beneficiaryToBeArchivedNotifications.createArchiveDueOneMonthNotifications()
  },

  /** Exports an anonymized copy of the database for Metabase analytics.
   * Runs daily at 05:00 */
  metabaseAnonymization: exportAnonymizedDatabase,

  /** Imports structure data from the data.inclusion API.
   * Runs every Sunday at 06:00 */
  dataInclusionStructureImport: importDataInclusionStructures,

  dataEducationSchoolImport: importDataEducationSchools,

  /** Run the DEK rewrap after having rotated the encryption key in Open Bao
   * Manually launched */
  rotateKEK: rotateKeyEncryptionKey
} satisfies Record<string, () => Promise<unknown>>

export type JobName = keyof typeof jobs
