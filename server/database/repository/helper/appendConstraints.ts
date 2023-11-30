import { SecurityRuleGrantee } from '../../../security'

export const appendConstraints = <T extends { where?: any }>(
  user: SecurityRuleGrantee,
  params: T,
  constraint: (user: SecurityRuleGrantee) => any
) => {
  params.where = params.where || {}
  Object.assign(params.where, constraint(user))
}
