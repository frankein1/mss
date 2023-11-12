import { isCreator } from '../helpers'
import { SecurityRuleGrantee, SecurityTargetWithCreator } from '../types'

export const canEditComment = (
  grantee: SecurityRuleGrantee,
  comment: SecurityTargetWithCreator
) => isCreator(grantee, comment)
