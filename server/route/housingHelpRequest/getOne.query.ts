import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { HousingHelpRequestService } from '~/server/services'

const handler = ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return HousingHelpRequestService.get({ ctx, id })
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await HousingHelpRequestService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view
}

export const getOne = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})

export type GetHousingHelpRequestOutput = Prisma.PromiseReturnType<
  typeof handler
>
