import dayjs from 'dayjs'
import { prismaClient } from '~/server/prisma'
import { withErrorCapture } from '../utils'

export async function cleanupUserActivities() {
  const res = await prismaClient.userActivity.deleteMany({
    where: {
      date: { lte: dayjs().subtract(12, 'month').toDate() }
    }
  })
  console.log(
    `cleanup-user-activities: [${new Date().toISOString()}]: ${res.count} deleted`
  )
}

/** User activities older than 12 months are deleted */
export default async function handler() {
  return await withErrorCapture(cleanupUserActivities)
}
