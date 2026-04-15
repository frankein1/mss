import z from 'zod/v4'
import {
  requiredLimitedStringConstraint,
  requiredNativeEnum
} from '../helpers.schema'
import { MinisterStatus } from '@prisma/client'

export const createMinisterSchema = z.object({
  firstName: requiredLimitedStringConstraint(50),
  lastName: requiredLimitedStringConstraint(50),
  function: requiredLimitedStringConstraint(200),
  government: requiredLimitedStringConstraint(200),
  status: requiredNativeEnum(MinisterStatus)
})

export type CreateMinisterInput = z.infer<typeof createMinisterSchema>
