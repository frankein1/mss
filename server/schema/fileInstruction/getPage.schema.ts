import type { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportFileInstructionsSchema } from './export.schema'

export const getFileInstructionPageSchema = exportFileInstructionsSchema
  .omit({ code: true })
  .extend(paginatedSchema.shape)

export type FileInstructionPageInput = z.infer<
  typeof getFileInstructionPageSchema
>
