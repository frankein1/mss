import dayjs from 'dayjs'
import { prismaClient } from '~~/server/prisma'
import { withErrorCapture } from '../utils'

export async function anonymizeExternalAttendees() {
  const threeMonthsAgo = dayjs().subtract(3, 'month').toDate()

  const res = await prismaClient.workshopExternalAttendee.updateMany({
    where: {
      isAnonymized: false,
      OR: [
        {
          workshopAttendee: {
            workshop: { date: { lte: threeMonthsAgo } }
          }
        },
        {
          workshopAttendee: null,
          created: { lte: threeMonthsAgo }
        }
      ]
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

/** Workshop external attendees are anonymized 3 months after the workshop date (age, city and gender are kept) */
export default async function handler() {
  return await withErrorCapture(anonymizeExternalAttendees)
}
