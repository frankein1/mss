import { z } from 'zod'
import { adminEditStructureSchemaBase } from './adminEditStructure.schema'

export const adminCreateStructureSchema = adminEditStructureSchemaBase.omit({
  structureId: true
})

export type AdminCreateStructureInput = z.infer<
  typeof adminCreateStructureSchema
>
