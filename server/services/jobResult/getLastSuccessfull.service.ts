import { JobStatus } from '@prisma/client'
import { JobResultRepo } from '~/server/database'

export const getLastSuccessfullJob = async (name: string) => {
  return await JobResultRepo.prisma.findFirst({
    where: { status: JobStatus.Success, name },
    orderBy: [{ startDate: 'desc' }]
  })
}
