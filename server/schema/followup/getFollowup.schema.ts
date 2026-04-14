import type { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportFollowupsSchema } from './exportFollowup.schema'

export const getFollowupsSchema = exportFollowupsSchema
  .omit({ code: true })
  .extend(paginatedSchema.shape)

export type GetFollowupsInput = z.infer<typeof getFollowupsSchema>
