import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'

export const createOrUpdateRelativeSchema = z.object({
  id: z.string().uuid().nonempty(),
  lastName: z.string().nullish(),
  firstName: z.string().nullish(),
  relationship: z.nativeEnum(RelativeRelationship).nullish(),
  city: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  caregiver: z.boolean().default(false),
  additionalInformation: z.string().nullish()
})

export type CreateOrUpdateRelativeInput = z.infer<
  typeof createOrUpdateRelativeSchema
>
