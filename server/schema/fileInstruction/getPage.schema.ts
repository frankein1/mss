import { z } from 'zod/v4'
import { paginatedSchema } from '../helpers.schema'
import { exportFileInstructionsSchema } from './export.schema'

export const getFileInstructionPageSchema = exportFileInstructionsSchema
  .omit({ code: true })
  .merge(paginatedSchema)

export type FileInstructionPageInput = z.infer<
  typeof getFileInstructionPageSchema
>
