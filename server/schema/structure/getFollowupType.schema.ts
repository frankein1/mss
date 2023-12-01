import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'

export const getFollowupTypeSchema = z.object({
  name: stringConstraint,
  structureId: z.string().uuid()
})

export type GetFollowupTypeInput = z.infer<typeof getFollowupTypeSchema>
