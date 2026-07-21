import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/database'

const handler = async ({
  ctx: {
    structure: { id },
    user
  }
}: {
  ctx: ProtectedAppContext
}) => {
  const structure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id }
  })

  return { structure }
}

export const getStructure = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
