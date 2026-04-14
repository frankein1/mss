import { EmailRepo } from '~/server/database'
import type { AppConfig } from '~/types/appConfig'

export const createEmail = async ({
  to,
  subject,
  text,
  html,
  config
}: {
  to: string
  subject: string
  text: string
  html: string
  config: Pick<AppConfig, 'public'>
}) => {
  const {
    public: {
      email: { from }
    }
  } = config

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
