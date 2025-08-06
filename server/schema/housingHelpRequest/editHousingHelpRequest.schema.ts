import { z } from 'zod/v4'
import { createHousingHelpRequestSchemaBase } from './createHousingHelpRequest.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editHousingHelpRequestSchema = createHousingHelpRequestSchemaBase
  .extend({
    id: z.uuid(),
    socialSupportId: z.uuid()
  })
  .refine(val => !val.isMinistry || val.ministre, {
    message: requiredErrorMessage,
    path: ['ministre']
  })

export type EditHousingHelpRequestInput = z.infer<
  typeof editHousingHelpRequestSchema
>
