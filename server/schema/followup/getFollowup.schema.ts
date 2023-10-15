import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportFollowupsSchema } from './exportFollowup.schema'

export const getFollowupsSchema = exportFollowupsSchema.merge(paginatedSchema)

export type GetFollowupsInput = z.infer<typeof getFollowupsSchema>
