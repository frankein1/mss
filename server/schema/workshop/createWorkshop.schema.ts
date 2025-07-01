import { z } from 'zod'
import {
  errorMessages,
  maxStringLengthMessage,
  validIntNumber
} from '~/utils/zod'
import {
  stringConstraint,
  withEmptyValueOptionalNativeEnum
} from '../helpers.schema'
import { AgeLimitCondition } from '@prisma/client'

export const createWorkshopSchema = z.object({
  name: stringConstraint.max(100, maxStringLengthMessage(100)),
  date: z.coerce.date(errorMessages),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: stringConstraint.max(200, maxStringLengthMessage(200)).optional(),
  partnerOrganizationId: z.string().uuid().optional(),
  host: z.string().optional(),
  sessionName: z.string().optional(),
  description: z.string().optional(),
  attendeeLimit: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .optional(),
  ageLimitCondition: withEmptyValueOptionalNativeEnum(AgeLimitCondition),
  ageLimit: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .optional()
})

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>
