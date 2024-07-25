import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { FamilyFileRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view.general
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return await FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiaries: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          birthDate: true,
          relationship: true
        },
        orderBy: { created: 'asc' }
      }
    }
  })
}

export const getFamilyFileMinimalInfoQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
