import { z } from 'zod'
import { validationCodeConstraint } from '../helpers.schema'
import { workshopFilterSchema } from '../filter.schema'

export const exportWorkshopsSchema = z.object({
  code: validationCodeConstraint,
  filter: workshopFilterSchema
})

export type ExportWorkshopsInput = z.infer<typeof exportWorkshopsSchema>
