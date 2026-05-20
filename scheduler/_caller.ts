import { initSentry, terminateSentry } from './utils'
import { jobs, type JobName } from './jobs'

const jobName = process.argv[2] as JobName | undefined

async function main() {
  if (!jobName || !jobs[jobName]) {
    const available = Object.keys(jobs).join(', ')
    console.error(
      jobName
        ? `Unknown job "${jobName}". Available: ${available}`
        : `Usage: _caller <job>\nAvailable jobs: ${available}`
    )
    process.exit(1)
  }

  initSentry()
  await jobs[jobName]()
  await terminateSentry()
}

main()
