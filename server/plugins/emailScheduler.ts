import dayjs from 'dayjs'
import { EmailStatus } from '@prisma/client'
import { useScheduler } from '#scheduler'
import { EmailRepo } from '~/server/database'
import { EMAIL_RETRY_DELAY, MAX_EMAIL_RETRY } from '~/utils/constants'
import { sendEmail } from '~/server/lib/email'

export default defineNitroPlugin(() => {
  startScheduler()
})

async function sendEmails() {
  const emails = await EmailRepo.prisma.findMany({
    where: {
      OR: [
        {
          status: EmailStatus.ToSend
        },
        {
          status: EmailStatus.Error,
          retryNumber: {
            lt: MAX_EMAIL_RETRY
          },
          sentDate: {
            lt: dayjs().subtract(EMAIL_RETRY_DELAY, 'milliseconds').toDate()
          }
        }
      ]
    }
  })

  // Update status to Sending
  await EmailRepo.prisma.updateMany({
    where: {
      id: {
        in: emails.map(email => email.id)
      }
    },
    data: {
      status: EmailStatus.Sending
    }
  })

  emails.forEach(async ({ id, to, from, subject, text, html }) => {
    // TODO: handle errors (with Error status)
    await sendEmail({ to, from, subject, text, html })
    await EmailRepo.prisma.update({
      where: { id },
      data: {
        retryNumber: { increment: 1 },
        sentDate: new Date(),
        status: EmailStatus.Sent
      }
    })
  })
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(sendEmails).everySeconds(5)
}
