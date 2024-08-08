import { jobConverter } from './jobConverter'
import { JobResultRepo } from '~/server/database'
import { UpdateJobDataInclusionStructureInput } from '~/server/schema'

export async function updateJob(job: UpdateJobDataInclusionStructureInput) {
  const res = await JobResultRepo.prisma.update({
    data: job,
    where: { id: job.id }
  })

  return jobConverter(res)
}
