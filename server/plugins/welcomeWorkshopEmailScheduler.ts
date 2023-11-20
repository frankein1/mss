import dayjs from 'dayjs'
import { UserRepo } from '~/server/database'
import { useScheduler } from '#scheduler'
import { sendEmail } from '~/server/lib/email'
import { getWelcomeWorkshopEmailContent } from '~/utils/user/emailContents'

export default defineNitroPlugin(() => {
  startScheduler()
})

async function sendWelcomeWorkshopEmail() {
  const usersCreatedLastWeek = await UserRepo.prisma.findMany({
    where: {
      created: dayjs().subtract(7, 'day').toDate()
    },
    select: { email: true }
  })

  usersCreatedLastWeek.forEach(user => {
    sendEmail({
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
