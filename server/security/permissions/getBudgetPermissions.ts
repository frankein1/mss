import type {
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import { getGranteRole, isReferentFor } from '../rules/helpers'

export type BudgetPermissions = {
  view: boolean
  edit: boolean
}

const FALSY_PERMISSIONS: BudgetPermissions = {
  view: false,
  edit: false
}

export const getBudgetPermissions = ({
  ctx,
  familyFile
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
}): BudgetPermissions => {
  const { manager, socialWorker, instructor, receptionAgent } =
    getGranteRole(ctx)

  if (receptionAgent) {
    return FALSY_PERMISSIONS
  }

  const hasAccess =
    manager || socialWorker || instructor || isReferentFor(ctx.user, familyFile)

  return {
    view: hasAccess,
    edit: hasAccess
  }
}
