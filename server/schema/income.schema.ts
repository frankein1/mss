import { z } from 'zod'
import { IncomeSource, RelativeRelationship } from '@prisma/client'
import {
  amountNumber,
  withEmptyValueOptionalNativeEnum
} from './helpers.schema'
import { errorMessages } from '~/utils/zod'

export const createOrUpdateIncomeSchema = z.object({
  id: z.string().uuid().nonempty(),
  hostedRelative: withEmptyValueOptionalNativeEnum(RelativeRelationship),
  incomeSource: z.array(z.nativeEnum(IncomeSource, errorMessages)),
  incomeAmount: amountNumber.nullish()
})

export type CreateOrUpdateIncomeInput = z.infer<
  typeof createOrUpdateIncomeSchema
>
