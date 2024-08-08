import { jobConverter } from './jobConverter'
import { JobResultRepo } from '~/server/database'
import { CreateJobResultInput } from '~/server/schema'

export async function createJob(job: CreateJobResultInput) {
  const res = await JobResultRepo.prisma.create({ data: job })

  return jobConverter(res)
}
