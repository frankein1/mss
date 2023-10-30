import { SecurityRuleGrantee, isAdmin, isReferent } from '~/server/security'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, { structureId: user.structureId, archived: null })

  if (isReferent(user)) {
    Object.assign(where, { referents: { some: { id: user.id } } })
  }
  return where
}

export const BeneficiaryConstraints = {
  get
}
