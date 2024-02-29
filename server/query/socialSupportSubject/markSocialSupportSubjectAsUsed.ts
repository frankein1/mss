import { SocialSupportSubjectRepo } from '~/server/database'

export function markSocialSupportSubjectAsUsed(ids: string[]) {
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
