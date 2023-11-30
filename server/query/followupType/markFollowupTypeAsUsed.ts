import { FollowupTypeRepo } from '~/server/database'

export function markFollowupTypeAsUsed(ids: string[]) {
  return FollowupTypeRepo.prisma.updateMany({
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
