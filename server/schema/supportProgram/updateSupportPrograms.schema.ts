import { z } from 'zod'
import { dateOrEmpty, limitedStringConstraint } from '../helpers.schema'

export const supportProgramSchema = z.object({
  id: z.string().uuid(),
  supportProgramNameId: z.string().uuid(),
  startDate: dateOrEmpty,
  endDate: dateOrEmpty,
  partnerOrganisationId: z.string().uuid().nullish(),
  precisions: limitedStringConstraint(2, 500).nullish(),
  exitReason: limitedStringConstraint(2, 500).nullish()
})

export type SupportProgramInput = z.infer<typeof supportProgramSchema>
