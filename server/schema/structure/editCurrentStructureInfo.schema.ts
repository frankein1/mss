import { z } from 'zod'
import { editStructureSchema } from './editStructure.schema'

export const editCurrentUserStructureInfoSchema = editStructureSchema.omit({
  structureId: true,
  socialSupportSubjects: true
})

export type EditCurrentUserStructureInfoInput = z.infer<
  typeof editCurrentUserStructureInfoSchema
>
