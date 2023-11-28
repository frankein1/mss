import { EmailRepo } from '~/server/database'

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
  const {
    public: {
      email: { from }
    }
  } = useRuntimeConfig()

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
