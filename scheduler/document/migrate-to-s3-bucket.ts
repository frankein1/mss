import { SCHEDULER_ENV } from '../env'
import { performance } from 'node:perf_hooks'
import { initSentry, terminateSentry } from '../utils'

/** This migration must be launched in a detached one-off container using
 * the Scalingo CLI or the Scalingo API.
 * As a result importing this function is equivalent to launching the migration.
 */
async function main() {
  initSentry()

  const maxDuration = SCHEDULER_ENV.document.migration.maxDurationHours
  const logEvery = 100
  const deadline = Date.now() + maxDuration * 3600 * 1000
  let iteration = 0
  let duration: number | undefined = undefined

  console.log(
    `migrate-to-s3-bucket: starting migration for ${maxDuration} hours`
  )
  const start = performance.now()

  while (Date.now() < deadline) {
    // TODO: implement migration here and stop when no document to migrate remain
    const stopCondition = true

    iteration++
    if (iteration % logEvery === 0) {
      duration = (performance.now() - start) / 1000
      console.log(
        `migrate-to-s3-bucket: ${iteration} documents migrated in ${duration} s`
      )
    }

    if (stopCondition) {
      break
    }
  }

  duration = (performance.now() - start) / 1000
  console.log(
    `migrate-to-s3-bucket: ${iteration} documents migrated in ${duration} s`
  )
}

main()
;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await terminateSentry()
    process.exit(1)
  })
)
