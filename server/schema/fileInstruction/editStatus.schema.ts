import { SocialSupportStatus } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum } from '../helpers.schema'

export const editFileInstructionStatusSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(SocialSupportStatus)
})

export type EditFileInstructionStatusInput = z.infer<
  typeof editFileInstructionStatusSchema
>
