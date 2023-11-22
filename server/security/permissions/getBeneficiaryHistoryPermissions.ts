import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import { isInSameStructureAs, isReferentFor } from '../rules/helpers'

export type BeneficiaryHistoryPermissions = {
  view: boolean
}

export const getBeneficiaryHistoryPermissions = ({
  user,
  target
}: {
  user: SecurityRuleGrantee
  target: SecurityTargetWithStructure & SecurityTargetWithReferents
}) => {
  return getEditPermissions({ user, target })
}

function getEditPermissions({
  user,
  target
}: {
  user: SecurityRuleGrantee
  target: SecurityTargetWithStructure & SecurityTargetWithReferents
}): BeneficiaryHistoryPermissions {
  return {
    view: accessHistory(user, target)
  }
}

const accessHistory = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)
