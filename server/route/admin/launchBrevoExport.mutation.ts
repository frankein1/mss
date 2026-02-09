import type { ExportBrevoContactsInput } from '~/server/schema'
import { exportBrevoContactsSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { AdminService, JobResultService } from '~/server/services'
import { createMutation } from '~/server/route'
import { UserActivityType } from '~/prisma/generated/client'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: ExportBrevoContactsInput
}) => {
  const ongoingJob = await JobResultService.getOngoingJob()
  if (ongoingJob) {
    return false
  }

  AdminService.launchBrevoExport(input.all)

  return true
}

export const launchBrevoExport = createMutation({
  inputValidation: exportBrevoContactsSchema,
  adminHandler,
  auditLog: {
    key: 'admin.brevo.export',
    target: 'User',
    targetId: ({ ctx }) => ctx.user.id,
    action: UserActivityType.EXPORT
  }
})
