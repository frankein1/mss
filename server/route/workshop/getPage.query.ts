import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import z from 'zod'
import { WorkshopService } from '~/server/services/workshops'
import { GetWorkshopsInput } from '~/server/services/workshops/getPage.service'

const getWorkshopsSchema = z.object({
  filter: z.object({
    passed: z.boolean()
  }),
  perPage: z.number(),
  page: z.number()
})

const handler = async ({
  input,
  ctx
}: {
  input: GetWorkshopsInput
  ctx: ProtectedAppContext
}) => {
  return await WorkshopService.getPage({ input, ctx })
}

export const getPageQuery = createQuery({
  inputValidation: getWorkshopsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
