import { z } from 'zod'
import { requiredNativeEnum } from '../helpers.schema'
import { RelativeRelationship } from '~/prisma/generated/enums'

export const linkToFamilyFileSchema = z.object({
  beneficiaryId: z.string().uuid(),
  familyFileId: z.string().uuid(),
  relationship: requiredNativeEnum(RelativeRelationship)
})

export type LinkToFamilyFileInput = z.infer<typeof linkToFamilyFileSchema>
