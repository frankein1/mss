import { z } from 'zod/v4'
import { createHelpRequestSchemaBase } from './createHelpRequest.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editHelpRequestSchema = createHelpRequestSchemaBase
  .extend({
    id: z.uuid(),
    socialSupportId: z.uuid()
  })
  .omit({
    financialSupport: true
  })
  .refine(val => !val.isMinistry || val.ministre, {
    message: requiredErrorMessage,
    path: ['ministre']
  })

export type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>
