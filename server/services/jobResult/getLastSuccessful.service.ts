import { JobStatus } from '~/prisma/generated/client'
import { JobResultRepo } from '~/server/database'

export const getLastSuccessfulJob = async (name: string) => {
  return await JobResultRepo.prisma.findFirst({
    where: { status: JobStatus.Success, name },
    orderBy: [{ startDate: 'desc' }]
  })
}
