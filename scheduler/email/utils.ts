import { EmailRepo } from '~/server/database'
import { createTransport } from 'nodemailer'

/** This is a copy of the utility without the dependency on nuxt */
export const createEmailSubject = (subject: string) => {
  const mssEnvironment = process.env.MSS_ENVIRONMENT || 'local'

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
  const from = process.env.EMAIL_FROM || ''

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
  const host = process.env.EMAIL_SMTP_HOST || ''
  const port = parseInt(process.env.EMAIL_SMTP_PORT || '587')
  const secure = (process.env.EMAIL_SMTP_SECURE || 'false') === 'true'
  const user = process.env.EMAIL_SMTP_USER || ''
  const pass = process.env.EMAIL_SMTP_PASSWORD || ''

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
