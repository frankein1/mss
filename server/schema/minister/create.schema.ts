import z from 'zod'
import {
  requiredLimitedStringConstraint,
  requiredNativeEnum
} from '../helpers.schema'
import { MinisterStatus } from '@prisma/client'

export const createMinisterSchema = z.object({
  firstName: requiredLimitedStringConstraint(),
  lastName: requiredLimitedStringConstraint(),
  function: requiredLimitedStringConstraint(),
  government: requiredLimitedStringConstraint(),
  status: requiredNativeEnum(MinisterStatus)
})

export type CreateMinisterInput = z.infer<typeof createMinisterSchema>
