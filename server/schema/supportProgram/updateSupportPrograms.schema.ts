import { z } from 'zod'
import {
  dateOrEmpty,
  limitedStringConstraint,
  requiredLimitedStringConstraint
} from '../helpers.schema'

export const supportProgramSchema = z.object({
  id: z.string().uuid(),
  name: requiredLimitedStringConstraint(50),
  startDate: dateOrEmpty,
  endDate: dateOrEmpty,
  partnerOrganisationId: z.string().uuid().nullish(),
  precisions: limitedStringConstraint(2, 500).nullish(),
  exitReason: limitedStringConstraint(2, 500).nullish()
})
