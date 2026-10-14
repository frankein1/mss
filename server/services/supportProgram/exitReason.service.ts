import { prismaClient } from '~~/server/prisma'
import { SupportProgramExitReasonRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security'

/**
 * Ensures every exit reason name exists for the user's structure (creating
 * new ones on the fly), and returns a `name -> id` map.
 *
 * The support program form lets users either pick an existing exit reason or
 * type a new one, mirroring how workshop names are handled.
 */
export async function resolveExitReasonIds(
  ctx: SecurityRuleContext,
  exitReasonNames: (string | null | undefined)[]
): Promise<Map<string, string>> {
  // Names are already trimmed by the input schema
  const names = [
    ...new Set(exitReasonNames.filter((name): name is string => !!name))
  ]

  if (names.length === 0) {
    return new Map()
  }

  const structureId = ctx.structure.id
  // TODO: optimize in case of large ExitReason number in structure
  const reasons = await prismaClient.$transaction(
    names.map(name =>
      SupportProgramExitReasonRepo.prisma.upsert({
        where: { structureId_name: { structureId, name } },
        update: {},
        create: { name, structureId, createdById: ctx.user.id },
        select: { id: true, name: true }
      })
    )
  )

  return new Map(reasons.map(r => [r.name, r.id]))
}

/**
 * Deletes the exit reasons of the user's structure that are no longer used by
 * any support program. Call this after deleting or updating support programs.
 */
export function deleteUnusedExitReasons(ctx: SecurityRuleContext) {
  return SupportProgramExitReasonRepo.deleteMany(ctx.user, {
    where: { structureId: ctx.structure.id, supportPrograms: { none: {} } }
  })
}
