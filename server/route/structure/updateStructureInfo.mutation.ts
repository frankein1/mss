import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { EditStructureInfoInput } from '~/server/schema'
import { editStructureInfoSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { StructureRepo } from '~/server/database'
import { UserActivityObject, UserActivityType } from '@prisma/client'

const handler = async ({
  input,
  ctx: { structure: userStructure }
}: {
  input: EditStructureInfoInput
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
  getAppContextPermissions(ctx).structure.edit

export const updateStructureInfo = createMutation({
  handler,
  inputValidation: editStructureInfoSchema,
  securityCheck,
  auditLog: {
    key: 'structure.update',
    target: UserActivityObject.Structure,
    targetId: ({ ctx }) => {
      return ctx.structure.id
    },
    action: UserActivityType.UPDATE
  }
})
