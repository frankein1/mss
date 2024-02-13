import { createMutation } from '~/server/route'
import {
  EditFileInstructionStatusInput,
  editFileInstructionStatusSchema
} from '~/server/schema'
import {
  getAppContextPermissions,
  SecurityRuleContext
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { FileInstructionService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: EditFileInstructionStatusInput
  ctx: ProtectedAppContext
}) => {
  return await FileInstructionService.updateStatus({ ctx, input })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.history

export const updateStatus = createMutation({
  securityCheck,
  handler,
  inputValidation: editFileInstructionStatusSchema
})
