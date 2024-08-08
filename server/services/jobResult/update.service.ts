import { jobConverter } from './jobConverter'
import { JobResultRepo } from '~/server/database'
import { UpdateJobResultInput } from '~/server/schema'

export async function updateJob(job: UpdateJobResultInput) {
  const res = await JobResultRepo.prisma.update({
    data: job,
    where: { id: job.id }
  })

  return jobConverter(res)
}
