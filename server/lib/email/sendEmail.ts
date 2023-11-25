import { createTransport } from 'nodemailer'

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
  const { email } = useRuntimeConfig()

  const transporter = createTransport({
    host: email.smtpHost,
    port: email.smtpPort,
    secure: email.smtpSecure,
    auth: {
      user: email.smtpUser,
      pass: email.smtpPassword
    }
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })
}
