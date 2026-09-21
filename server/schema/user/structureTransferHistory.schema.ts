import { UserRole } from '@prisma/client'
import { z } from 'zod'
import { requiredUuid } from '../helpers.schema'

const structureTransferHistoryEntrySchema = z.object({
  structureId: requiredUuid,
  role: z.nativeEnum(UserRole),
  leftAt: z.date({ coerce: true })
})

export const structureTransferHistorySchema = z.array(
  structureTransferHistoryEntrySchema
)

export type StructureTransferHistoryEntry = z.infer<
  typeof structureTransferHistoryEntrySchema
>

export function parseStructureTransferHistory(
  raw: unknown
): StructureTransferHistoryEntry[] {
  if (raw == null) {
    return []
  }
  const result = structureTransferHistorySchema.safeParse(raw)
  return result.success ? result.data : []
}

export function hasTransferredStructureInfo(
  structureTransferHistory: unknown
): boolean {
  return parseStructureTransferHistory(structureTransferHistory).length > 0
}
