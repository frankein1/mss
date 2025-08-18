import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopService } from '~/server/services/workshop'
import {
  GetWorkshopListInput,
  getWorkshopListSchema
} from '~/server/schema/workshop/getWorkshopList.schema'

const handler = async ({
  input,
  ctx
}: {
  input: GetWorkshopListInput
  ctx: ProtectedAppContext
}) => {
  return await WorkshopService.getPage({ input, ctx })
}

export const getPageQuery = createQuery({
  inputValidation: getWorkshopListSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
