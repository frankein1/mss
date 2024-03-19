import { SocialSupportSubjectRepo } from '~/server/database'
import { UpdateSocialSupportSubjectNameInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function update({
  input
}: {
  ctx: SecurityRuleContext
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
