import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { PartnerOrganizationRepo } from '~/server/database'

const handler = ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) =>
  PartnerOrganizationRepo.update(ctx.user, {
    where: {
      id: input.id,
      structureId: ctx.structure.id
    },
    data: { inactive: false },
    select: {
      id: true,
      name: true
    }
  })

export const makeActive = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    key: 'partner.makeActive',
    target: 'PartnerOrganization',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
