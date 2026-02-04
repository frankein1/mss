import { emptySchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { AdminService, JobResultService } from '~/server/services'
import { createMutation } from '~/server/route'
import { UserActivityType } from '@prisma/client'

const adminHandler = async ({ ctx: _ctx }: { ctx: AdminContext }) => {
  const ongoingJob = await JobResultService.getOngoingJob()
  if (ongoingJob) {
    return false
  }

  AdminService.launchDataInclusionStructureImport()

  return true
}

export const launchStructureImport = createMutation({
  inputValidation: emptySchema,
  adminHandler,
  auditLog: {
    key: 'admin.dataInclusion.import',
    target: 'User',
    targetId: ({ ctx }) => ctx.user.id,
    action: UserActivityType.IMPORT
  }
})
