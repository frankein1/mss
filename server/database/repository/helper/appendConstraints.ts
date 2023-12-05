import merge from 'lodash.merge'
import { SecurityRuleGrantee } from '../../../security'

export const appendConstraints = <T extends { where?: any }>(
  user: SecurityRuleGrantee,
  params: T,
  constraints: {
    get: (user: SecurityRuleGrantee) => any
  }
) => {
  params.where = params.where || {}
  merge(params.where, constraints.get(user))
}
