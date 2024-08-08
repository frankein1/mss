import { jobConverter } from './jobConverter'
import { JobResultRepo } from '~/server/database'
import { CreateJobDataInclusionStructureInput } from '~/server/schema'

export async function createJob(job: CreateJobDataInclusionStructureInput) {
  const res = await JobResultRepo.prisma.create({ data: job })

  return jobConverter(res)
}
