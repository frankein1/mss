import { StructureRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export const getStructureByUser = async (user: SecurityRuleGrantee) => {
  const structure = await StructureRepo.findUniqueOrThrow(user, {
    where: {
      id: user.structureId || ''
    },
    select: {
      type: true
    }
  })
  return structure
}
