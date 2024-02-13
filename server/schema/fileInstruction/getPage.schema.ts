import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportFileInstructionsSchema } from './export.schema'

export const getFileInstructionPageSchema =
  exportFileInstructionsSchema.merge(paginatedSchema)

export type FileInstructionPageInput = z.infer<
  typeof getFileInstructionPageSchema
>
