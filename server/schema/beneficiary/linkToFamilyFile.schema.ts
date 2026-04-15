import { z } from 'zod/v4'
import { requiredNativeEnum } from '../helpers.schema'
import { RelativeRelationship } from '@prisma/client'

export const linkToFamilyFileSchema = z.object({
  beneficiaryId: z.string().uuid(),
  familyFileId: z.string().uuid(),
  relationship: requiredNativeEnum(RelativeRelationship)
})

export type LinkToFamilyFileInput = z.infer<typeof linkToFamilyFileSchema>
