import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'
import { PartnerOrganizationRepo } from '~/server/database'

export const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: { id: string }
}) => {
  return await PartnerOrganizationRepo.findUniqueOrThrow(user, {
    where: { id: input.id },
    include: {
      contacts: true,
      dataInclusionStructure: true
    }
  })
}

export const getOne = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: idSchema
})
