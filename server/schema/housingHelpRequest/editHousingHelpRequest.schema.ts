import { z } from 'zod'
import { createHousingHelpRequestSchemaBase } from './createHousingHelpRequest.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editHousingHelpRequestSchema = createHousingHelpRequestSchemaBase
  .extend({
    id: z.string().uuid(),
    socialSupportId: z.string().uuid()
  })
  .refine(val => !val.isMinistry || val.ministre, {
    message: requiredErrorMessage,
    path: ['ministre']
  })

export type EditHousingHelpRequestInput = z.infer<
  typeof editHousingHelpRequestSchema
>
