import { EmailStatus } from '@prisma/client'
import { createQuery } from '~/server/route'
import { AdminSendEmailInput, adminSendEmailSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { EmailRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({
  input: { id }
}: {
  ctx: AdminContext
  input: AdminSendEmailInput
}) => {
  const email = await EmailRepo.prisma.update({
    where: { id },
    select: {
      id: true,
      to: true,
      subject: true,
      status: true,
      sentDate: true,
      retryNumber: true
    },
    data: {
      status: EmailStatus.ToSend
    }
  })

  return { email }
}

export const adminSendEmailQuery = createQuery({
  inputValidation: adminSendEmailSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
