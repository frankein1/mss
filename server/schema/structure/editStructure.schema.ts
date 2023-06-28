import { z } from 'zod'
import { createStructureSchema } from './createStructure.schema'

export const editStructureSchema = createStructureSchema
  .omit({ type: true })
  .extend({
    structureId: z.string().uuid()
  })
