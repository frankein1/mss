import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import z from 'zod/v4'
import {
  GetWorkshopsInput,
  workshopFilterSchema
} from '~/server/services/workshop/getPage.service'
import { WorkshopService } from '~/server/services/workshop'

const getWorkshopsSchema = z.object({
  filter: workshopFilterSchema,
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
