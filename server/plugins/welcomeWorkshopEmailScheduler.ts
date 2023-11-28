import dayjs from 'dayjs'
import { UserRepo } from '~/server/database'
import { useScheduler } from '#scheduler'
import { createEmail } from '~/server/query'
import { getWelcomeWorkshopEmailContent } from '~/server/email'

export default defineNitroPlugin(() => {
  startScheduler()
})

async function sendWelcomeWorkshopEmail() {
  const usersCreatedLastWeek = await UserRepo.prisma.findMany({
    where: {
      created: {
        gte: dayjs().subtract(7, 'day').toDate(),
        lte: dayjs().subtract(6, 'day').toDate()
      }
    },
    select: { email: true }
  })

  usersCreatedLastWeek.forEach(user => {
    createEmail({
      to: user.email,
      subject: 'Mon Suivi Social - Vos premiers pas ✨',
      ...getWelcomeWorkshopEmailContent()
    })
  })
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(sendWelcomeWorkshopEmail).dailyAt(1, 0)
}
