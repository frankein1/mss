import { z } from 'zod'
import { maxStringLengthMessage } from '~/utils/zod'
import { stringConstraint, dateOrEmpty } from '../helpers.schema'

export const supportProgramSchema = z.object({
  id: z.string().uuid(),
  name: stringConstraint.max(200, maxStringLengthMessage(200)),
  startDate: dateOrEmpty,
  endDate: dateOrEmpty,
  partnerOrganisationId: z.string().uuid().nullish(),
  precisions: stringConstraint.max(500, maxStringLengthMessage(500)).nullish(),
  exitReason: stringConstraint.max(500, maxStringLengthMessage(500)).nullish()
})
