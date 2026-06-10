import { initSentry, terminateSentry } from './utils'
import { jobs, type JobName } from './jobs'
import { scalingoRun } from './scalingo-utils'
import { prismaClient } from '~/server/prisma'

const jobName = process.argv[2]
const detached = process.argv.includes('--detached')

;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.once(signal, async () => {
    await terminateSentry()
    await prismaClient.$disconnect()
    process.exit(1)
  })
)

async function main() {
  if (!jobName || !jobs[jobName as JobName]) {
    const available = Object.keys(jobs).join(', ')
    console.error(
      jobName
        ? `Unknown job "${jobName}". Available: ${available}`
        : `Usage: _caller <job> [--detached]\nAvailable jobs: ${available}`
    )
    process.exit(1)
  }

  if (detached) {
    console.info('Running job in one-off detached container')
    await scalingoRun(jobName as JobName)
    return
  }

  initSentry()
  try {
    await jobs[jobName as JobName]()
  } finally {
    await terminateSentry()
    await prismaClient.$disconnect()
  }
}

main()
