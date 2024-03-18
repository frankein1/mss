import { SocialSupportSubjectRepo } from '~/server/database'
import { GetSocialSupportSubjectInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function get({
  ctx: { user },
  input
}: {
  ctx: SecurityRuleContext
  input: GetSocialSupportSubjectInput
}) {

  const subjects = await SocialSupportSubjectRepo.findMany(
    user, {
    where: {
      name: { equals: input.name, mode: 'insensitive' },
      ownedByStructureId: input.structureId
    }
  })

  return subjects.length > 0 ? subjects[0] : null
}
