import { z } from 'zod'
import {
  errorMessages,
  maxStringLengthMessage,
  validIntNumber
} from '~/utils/zod'
import {
  requiredLimitedStringConstraint,
  stringConstraint,
  withEmptyValueOptionalNativeEnum
} from '../helpers.schema'
import { AgeLimitCondition } from '@prisma/client'

export const createWorkshopSchema = z.object({
  name: requiredLimitedStringConstraint(100),
  date: z.coerce.date(errorMessages),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  location: stringConstraint.max(200, maxStringLengthMessage(200)).nullish(),
  partnerOrganizationId: z.string().nullish(),
  host: z.string().nullish(),
  sessionName: z.string().nullish(),
  description: z.string().nullish(),
  attendeeLimit: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .nullish(),
  ageLimitCondition: withEmptyValueOptionalNativeEnum(AgeLimitCondition),
  ageLimit: z.coerce
    .number()
    .int(validIntNumber)
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
    .nullish()
})

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>
