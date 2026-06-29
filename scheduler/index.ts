import { Cron } from 'croner'
import { initSentry } from './utils'
import { jobs } from './jobs'

/**
 * WARNING!
 * Crons that do exact date matching against @db.Date columns must run
 * **after 2 AM Paris**.
 *
 * Otherwise, in summer time (CEST), the UTC date is still the previous
 * day
 */
const timezone = 'Europe/Paris'

function startScheduler() {
  console.log(`[scheduler]: [${new Date().toISOString()}]: starting crons`)

  initSentry()

  const every30seconds = '*/30 * * * * *'
  new Cron(every30seconds, jobs.queuedEmailSender, {
    timezone,
    name: 'queuedEmailSender'
  })

  const at23pm = '0 23 * * *'
  new Cron(at23pm, jobs.emailCreator, { timezone, name: 'emailCreator' })

  const atMidnight = '0 0 * * *'
  new Cron(atMidnight, jobs.anonymizer, { timezone, name: 'anonymizer' })

  const at30past2am = '30 2 * * *'
  new Cron(at30past2am, jobs.disableInactiveStructures, {
    timezone,
    name: 'disableInactiveStructures'
  })

  const at3am = '0 3 * * *'
  new Cron(at3am, jobs.notificationCreator, {
    timezone,
    name: 'notificationCreator'
  })

  const at5am = '0 5 * * *'
  new Cron(at5am, jobs.metabaseAnonymization, {
    timezone,
    name: 'metabaseAnonymization'
  })

  const everySundayAt3am = '0 3 * * 0'
  new Cron(everySundayAt3am, jobs.dataEducationSchoolImport, {
    timezone,
    name: 'dataEducationSchoolImport'
  })

  const everySundayAt6am = '0 6 * * 0'
  new Cron(everySundayAt6am, jobs.dataInclusionStructureImport, {
    timezone,
    name: 'dataInclusionStructureImport'
  })
}

startScheduler()
