import type { SecurityRuleContext } from '~/server/security'
import { WorkshopRepo } from '~/server/database'

export const getAllFuture = async ({ ctx }: { ctx: SecurityRuleContext }) => {
  const results = await WorkshopRepo.findMany(ctx.user, {
    where: {
      date: {
        gte: new Date()
      }
    },
    select: {
      id: true,
      workshopName: {
        select: {
          name: true
        }
      },
      workshopAttendees: {
        select: {
          beneficiaryId: true,
          listType: true
        }
      },
      sessionName: true,
      date: true,
      attendeeLimit: true,
      _count: true
    },
    orderBy: [{ date: 'asc' }]
  })
  return results
}
