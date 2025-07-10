import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { updateWorkshopSchema, UpdateWorkShopInput } from '~/server/schema'
import { WorkshopRepo, PartnerOrganizationRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateWorkShopInput
) => {
  if (!input.partnerOrganizationId) {
    return true
  }
  try {
    await PartnerOrganizationRepo.findUniqueOrThrow(ctx.user, {
      where: { id: input.partnerOrganizationId },
      select: { id: true }
    })
  } catch {
    return false
  }
  return true
}

const handler = ({
  input: { partnerOrganizationId, ...input },
  ctx
}: {
  input: UpdateWorkShopInput
  ctx: ProtectedAppContext
}) =>
  WorkshopRepo.update(ctx.user, {
    where: { id: input.id },
    data: {
      ...input,
      partnerOrganization: partnerOrganizationId
        ? { connect: { id: partnerOrganizationId } }
        : { disconnect: true }
    }
  })

export const updateWorkshop = createMutation({
  inputValidation: updateWorkshopSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateWorkshop',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.UPDATE
  }
})
