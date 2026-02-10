import { z } from 'zod'
import {
  errorMessages,
  maxStringLengthMessage,
  validIntNumber
} from '~/utils/zod'
import {
  requiredLimitedStringConstraint,
  stringConstraint,
  limitedStringConstraint,
  withEmptyValueOptionalNativeEnum
} from '../helpers.schema'
import { AgeLimitCondition } from '~/prisma/generated/enums'
import { timeGroup } from '~/client/options'

export const createWorkshopSchemaBase = z.object({
  name: requiredLimitedStringConstraint(100),
  date: z.coerce.date(errorMessages),
  startTime: limitedStringConstraint(null, 6).nullish(),
  endTime: limitedStringConstraint(null, 6).nullish(),
  location: stringConstraint.max(200, maxStringLengthMessage(200)).nullish(),
  partnerOrganizationId: z.string().uuid().nullish(),
  host: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  sessionName: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  description: stringConstraint
    .max(1000, maxStringLengthMessage(1000))
    .nullish(),
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
    .nullish(),
  chargeable: z.boolean().default(false)
})

export const createWorkshopSchema = createWorkshopSchemaBase
  .refine(
    data => {
      if (!data.startTime || !data.endTime) {
        return true
      }
      const startIndex = timeGroup.indexOf(data.startTime)
      const endIndex = timeGroup.indexOf(data.endTime)
      return endIndex > startIndex
    },
    {
      message: "L'heure de fin doit être supérieure à l'heure de début",
      path: ['endTime']
    }
  )
  .refine(
    data => {
      if (!data.endTime) {
        return true
      }

      return data.startTime != null
    },
    {
      message: 'Veuillez saisir une heure de début',
      path: ['endTime']
    }
  )

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>
