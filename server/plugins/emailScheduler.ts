import dayjs from 'dayjs'
import { EmailStatus, Prisma } from '@prisma/client'
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
    const data: Prisma.EmailUpdateInput = {
      retryNumber: { increment: 1 },
      sentDate: new Date()
    }
    // TODO: handle bounced emails
    try {
      await sendEmail({ to, from, subject, text, html })
      data.status = EmailStatus.Sent
    } catch (error) {
      data.status = EmailStatus.Error
    } finally {
      await EmailRepo.prisma.update({
        where: { id },
        data
      })
    }
  })
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(sendEmails).everySeconds(5)
}
