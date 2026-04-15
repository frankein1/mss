import type { z } from 'zod/v4'
import { paginatedSchema } from '../helpers.schema'
import { exportFollowupsSchema } from './exportFollowup.schema'

export const getFollowupsSchema = exportFollowupsSchema
  .omit({ code: true })
  .extend(paginatedSchema.shape)

export type GetFollowupsInput = z.infer<typeof getFollowupsSchema>
