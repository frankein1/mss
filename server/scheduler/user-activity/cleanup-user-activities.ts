import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import { performance } from 'node:perf_hooks'
import * as Sentry from '@sentry/node'

const prismaClient = new PrismaClient()

async function cleanupUserActivities() {
  const start = performance.now()
  const sentryDsn = process.env.SENTRY_DSN

  if (sentryDsn) {
    console.log(
      `cleanup-user-activities: [${new Date().toISOString()}]: sentry initialization`
    )
    Sentry.init({ dsn: sentryDsn })
  }

  try {
    const res = await prismaClient.userActivity.deleteMany({
      where: {
        date: { lte: dayjs().subtract(12, 'month').toDate() }
      }
    })
    console.log(
      `cleanup-user-activities: [${new Date().toISOString()}]: ${res.count} deleted`
    )
  } catch (e: unknown) {
    console.error('cleanup-user-activities: error during activity log cleanup')
    console.error(e)

    if (sentryDsn) {
      Sentry.captureException(e)
    }
  } finally {
    const end = performance.now()
    if (sentryDsn) {
      await Sentry.close(2000)
    }
    await prismaClient.$disconnect()

    const duration = (end - start) / 1000
    console.log(
      `cleanup-user-activities: [${new Date().toISOString()}]: duration: ${duration}s`
    )
  }
}

cleanupUserActivities()
