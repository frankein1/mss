import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportFileInstructionsSchema } from './export.schema'

export const getFileInstructionPageSchema = exportFileInstructionsSchema
  .omit({ code: true })
  .merge(paginatedSchema)

export type FileInstructionPageInput = z.infer<
  typeof getFileInstructionPageSchema
>
