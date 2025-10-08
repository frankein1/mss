import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import { performance } from 'node:perf_hooks'

const prismaClient = new PrismaClient()

async function anonymizeExternalAttendees() {
  const start = performance.now()

  try {
    const res = await prismaClient.workshopExternalAttendee.updateMany({
      where: {
        isAnonymized: false,
        created: { lte: dayjs().subtract(3, 'month').toDate() }
      },
      data: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        isAnonymized: true
      }
    })
    console.log(
      `anonymize-external-attendees: [${new Date().toISOString()}]: ${res.count} external attendees archived`
    )
  } catch (e: unknown) {
    console.error(
      'anonymize-external-attendees: error during external attendees anonymization'
    )
    console.error(e)
    throw e
  } finally {
    const end = performance.now()
    await prismaClient.$disconnect()

    const duration = (end - start) / 1000
    console.log(
      `anonymize-external-attendees: [${new Date().toISOString()}]: duration: ${duration}s`
    )
  }
}

anonymizeExternalAttendees()
