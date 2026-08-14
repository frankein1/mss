import { z } from 'zod'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'
import { workshopFilterSchema } from '../filter.schema'

export const exportWorkshopsSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  filter: workshopFilterSchema
})

export type ExportWorkshopsInput = z.infer<typeof exportWorkshopsSchema>
