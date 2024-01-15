import {
  SecurityRuleContext,
  SecurityTargetWithCreator,
  isCreator
} from '../rules'

export type CommentPermissions = {
  edit: boolean
  delete: boolean
}

export const getCommentPermissions = ({
  ctx,
  comment
}: {
  ctx: SecurityRuleContext
  comment: SecurityTargetWithCreator
}) => {
  const creator = isCreator(ctx.user, comment)
  return {
    edit: creator,
    delete: creator
  }
}
