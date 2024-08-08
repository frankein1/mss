import { emptySchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { AdminService, JobResultService } from '~/server/services'
import { createMutation } from '~/server/route'

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
  adminHandler
})
