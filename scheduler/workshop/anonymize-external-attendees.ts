import dayjs from 'dayjs'
import { prismaClient } from '~/server/prisma'
import { withErrorCapture } from '../utils'

async function anonymizeExternalAttendees() {
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
}

/** Workshop external attendees are anonymized after 3 months (age, city and gender are kept) */
export default async function handler() {
  return await withErrorCapture(anonymizeExternalAttendees)
}
