import { z } from 'zod/v4'
import { paginatedSchema } from '../helpers.schema'
import { exportFollowupsSchema } from './exportFollowup.schema'

export const getFollowupsSchema = exportFollowupsSchema
  .omit({ code: true })
  .merge(paginatedSchema)

export type GetFollowupsInput = z.infer<typeof getFollowupsSchema>
