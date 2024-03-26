import dayjs from 'dayjs'
import { EmailStatus } from '@prisma/client'
import { useScheduler } from '#scheduler'
import { EmailRepo } from '~/server/database'
import { sendEmail } from '~/server/lib/email'
import { minutesToMillis } from '~/utils/time'

const SCHEDULER_IN_SECONDS = 30
const MAX_EMAIL_RETRY = 3
const EMAIL_RETRY_DELAY = minutesToMillis(60)

export default defineNitroPlugin(() => {
  startScheduler()
})

async function sendEmails() {
  const emails = await findEmailsToSend()
  await markAsSending(emails.map(email => email.id) || [])

  for (const email of emails) {
    const { id, to, from, subject, text, html } = email

    try {
      await sendEmail({ to, from, subject, text, html })
      await markAsSent(id)
    } catch (err) {
      await markInError(id, JSON.stringify(err))
    }
  }
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(sendEmails).everySeconds(SCHEDULER_IN_SECONDS)
}

function findEmailsToSend() {
  return EmailRepo.prisma.findMany({
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
}

function markAsSending(ids: string[]) {
  return EmailRepo.prisma.updateMany({
    where: {
      id: {
        in: ids
      }
    },
    data: {
      status: EmailStatus.Sending,
      error: null
    }
  })
}
function markInError(id: string, error: string) {
  return EmailRepo.prisma.update({
    where: {
      id
    },
    data: {
      status: EmailStatus.Error,
      error,
      retryNumber: { increment: 1 },
      sentDate: new Date()
    }
  })
}
function markAsSent(id: string) {
  return EmailRepo.prisma.update({
    where: {
      id
    },
    data: {
      status: EmailStatus.Sent,
      error: null,
      retryNumber: { increment: 1 },
      sentDate: new Date()
    }
  })
}
