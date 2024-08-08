import { SocialSupportSubjectRepo } from '~/server/database'

export function markUsed(ids: string[]) {
  return SocialSupportSubjectRepo.prisma.updateMany({
    where: {
      id: {
        in: ids
      }
    },
    data: {
      used: true
    }
  })
}
