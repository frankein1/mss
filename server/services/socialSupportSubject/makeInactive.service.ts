import { SocialSupportSubjectRepo } from '~/server/database'
import { IdInput } from '~/server/schema'

export async function makeInactive({ input }: { input: IdInput }) {
  const res = await SocialSupportSubjectRepo.prisma.update({
    where: { id: input.id },
    data: {
      inactive: true
    },
    select: { id: true }
  })

  return res
}
