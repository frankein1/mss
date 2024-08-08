import { JobResultRepo } from '~/server/database'

export async function getOngoingJob() {
  return await JobResultRepo.prisma.findFirst({
    where: { status: 'Ongoing' }
  })
}
