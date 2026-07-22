import { SupportProgramOutcome } from '@prisma/client'
import { z } from 'zod'
import {
  dateOrEmpty,
  limitedStringConstraint,
  withEmptyValueOptionalNativeEnum
} from '../helpers.schema'

export const supportProgramSchema = z
  .object({
    id: z.string().uuid(),
    supportProgramNameId: z.string().uuid(),
    startDate: dateOrEmpty,
    endDate: dateOrEmpty,
    partnerOrganisationId: z.string().uuid().nullish(),
    outcome: withEmptyValueOptionalNativeEnum(SupportProgramOutcome),
    exitReason: limitedStringConstraint(2, 500).nullish()
  })
  .transform(sp => ({
    ...sp,
    outcome: sp.endDate ? sp.outcome : null
  }))

export type SupportProgramInput = z.infer<typeof supportProgramSchema>
