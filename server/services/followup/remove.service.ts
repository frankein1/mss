import { FollowupRepo } from '~/server/database'

export function remove(id: string) {
  return FollowupRepo.prisma.delete({ where: { id } })
}
