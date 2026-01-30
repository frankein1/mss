import { Cron } from 'croner'
import { initSentry, terminateSentry, withErrorCapture } from './utils'

const timezone = 'Europe/Paris'

/** Test handler */
export default async function testHandler() {
  return await withErrorCapture(() => console.log('scheduler: test cron job'))
}

function startScheduler() {
  console.log(`[scheduler]: [${new Date().toISOString()}]: starting crons`)

  initSentry()

  const every5minutes = '*/5 * * * *'
  new Cron(every5minutes, testHandler, {
    timezone,
    name: 'testHandler'
  })
}

startScheduler()
;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, terminateSentry)
)
