import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await NotificationRepo.findMany(user, {
    where: {
      recipientId: user.id
    },
    select: {
      archiveDate: true,
      beneficiary: {
        select: {
          id: true,
          title: true,
          firstName: true,
          usualName: true,
          birthName: true
        }
      }
    },
    orderBy: {
      created: 'desc'
    }
  })
}

export const getArchiveNotificationsQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
