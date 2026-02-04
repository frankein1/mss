import { EmailRepo } from '~/server/database'
import { createTransport } from 'nodemailer'
import { SCHEDULER_ENV } from '../env'

/** This is a copy of the utility without the dependency on nuxt */
export const createEmailSubject = (subject: string) => {
  const mssEnvironment = SCHEDULER_ENV.public.mssEnvironment

  if (mssEnvironment === 'development') {
    return `[DEV] ${subject}`
  }
  if (mssEnvironment === 'local') {
    return `[LOCAL] ${subject}`
  }
  if (mssEnvironment === 'demo') {
    return `[DEMO] ${subject}`
  }
  return subject
}

/** This is a copy of the mail sending utility without the dependency on nuxt */
export const createEmail = async ({
  to,
  subject,
  text,
  html
}: {
  to: string
  subject: string
  text: string
  html: string
}) => {
  const from = SCHEDULER_ENV.public.email.from

  if (!from) {
    throw new Error(
      'createEmail: no sender defined in email sender for scheduler'
    )
  }

  await EmailRepo.prisma.create({
    data: {
      from,
      to,
      subject,
      text,
      html
    }
  })
}

export const sendEmail = async ({
  to,
  from,
  subject,
  text,
  html
}: {
  to: string
  from: string
  subject: string
  text: string
  html: string
}) => {
  const host = SCHEDULER_ENV.email.smtpHost
  const port = SCHEDULER_ENV.email.smtpPort
  const secure = SCHEDULER_ENV.email.smtpSecure
  const user = SCHEDULER_ENV.email.smtpUser
  const pass = SCHEDULER_ENV.email.smtpPassword

  const transporter = createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })
}
