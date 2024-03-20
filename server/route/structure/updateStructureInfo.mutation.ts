import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  editCurrentUserStructureInfoSchema,
  EditCurrentUserStructureInfoInput
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { StructureRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { structure: userStructure }
}: {
  input: EditCurrentUserStructureInfoInput
  ctx: ProtectedAppContext
}) => {
  const updatedStructure = await StructureRepo.prisma.update({
    where: { id: userStructure.id },
    data: input,
    select: {
      id: true
    }
  })

  return updatedStructure
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const updateStructureInfo = createMutation({
  handler,
  inputValidation: editCurrentUserStructureInfoSchema,
  securityCheck
})
