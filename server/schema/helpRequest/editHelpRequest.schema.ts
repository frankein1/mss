import { z } from 'zod'
import { createHelpRequestSchemaBase } from './createHelpRequest.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editHelpRequestSchema = createHelpRequestSchemaBase
  .extend({
    id: z.string().uuid(),
    socialSupportId: z.string().uuid()
  })
  .omit({
    financialSupport: true
  })
  .refine(val => !val.isMinistry || val.ministerId, {
    message: requiredErrorMessage,
    path: ['ministerId']
  })

export type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>
