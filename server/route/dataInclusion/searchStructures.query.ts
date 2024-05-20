import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SearchDataInclusionStructureInput,
  searchDataInclusionStructureSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DataInclusionService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SearchDataInclusionStructureInput
  ctx: ProtectedAppContext
}) => {
  return await DataInclusionService.searchStructures({ ctx, input })
}

export const searchStructures = createQuery({
  inputValidation: searchDataInclusionStructureSchema,
  securityCheck,
  handler
})
