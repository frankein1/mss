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
    partnerOrganisationIds: z.array(z.string().uuid()).default([]),
    outcome: withEmptyValueOptionalNativeEnum(SupportProgramOutcome),
    exitReason: limitedStringConstraint(2, 500).nullish()
  })
  .refine(data => !data.endDate || !!data.startDate, {
    message: "Veuillez saisir une date d'entrée également",
    path: ['endDate']
  })
  .refine(
    data =>
      !data.endDate ||
      !data.startDate ||
      data.endDate.getTime() >= data.startDate.getTime(),
    {
      message: "La date de sortie doit être postérieure à la date d'entrée",
      path: ['endDate']
    }
  )

export type SupportProgramInput = z.input<typeof supportProgramSchema>
