import { SocialSupportSubjectRepo } from '~/server/database'
import { UpdateSocialSupportSubjectNameInput } from '~/server/schema'

export async function update({
  input
}: {
  input: UpdateSocialSupportSubjectNameInput
}) {
  const res = await SocialSupportSubjectRepo.prisma.update({
    where: { id: input.id },
    data: {
      name: input.name
    },
    select: { id: true }
  })

  return res
}
