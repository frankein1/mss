import { EmailRepo } from '~/server/database'
import type { EnvironmentConfig } from '~/types/environmentConfig'

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
  config: EnvironmentConfig
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
