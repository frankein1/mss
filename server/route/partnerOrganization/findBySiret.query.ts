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
    select: {
      id: true,
      name: true,
      siret: true,
      email: true,
      address: true,
      city: true,
      zipcode: true,
      phone1: true,
      phone2: true,
      workingHours: true
    }
  })
  return res.length ? res[0] : null
}

export const findBySiret = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: siretSchema
})
