import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { siretSchema } from '~/server/schema'
import { PartnerOrganizationRepo } from '~/server/database'

export const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: { siret: string }
}) => {
  const res = await PartnerOrganizationRepo.findMany(ctx.user, {
    where: { siret: input.siret, structureId: ctx.structure.id },
    include: {
      contacts: true
    }
  })
  return res.length ? res[0] : null
}

export const findBySiret = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: siretSchema
})
