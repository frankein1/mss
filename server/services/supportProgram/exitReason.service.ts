import type { Prisma } from '@prisma/client'
import { SupportProgramExitReasonRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security'

/**
 * Within the given transaction, ensures every exit reason name exists for the
 * user's structure (creating new ones on the fly) and returns a `name -> id`
 * map. The support program form lets users pick an existing exit reason or
 * type a new one.
 *
 * Must run inside the same transaction as the support program write: a reason
 * is then created and linked atomically, so it is never visible to other
 * requests in a committed-but-unlinked state.
 *
 * Raw transaction client: the constraint layer cannot run inside an
 * interactive transaction (no repository accepts a `tx`), so `structureId` is
 * taken from the server-trusted context. See
 * docs/review-1198-dispositifs-motifs-de-sortie.md (Addendum 2, decision 3).
 */
export async function resolveExitReasonIds(
  tx: Prisma.TransactionClient,
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
  const reasons: { id: string; name: string }[] = []
  // Sequential: parallel queries on a single interactive transaction client
  // are not supported.
  for (const name of names) {
    reasons.push(
      await tx.supportProgramExitReason.upsert({
        where: { structureId_name: { structureId, name } },
        update: {},
        create: { name, structureId, createdById: ctx.user.id },
        select: { id: true, name: true }
      })
    )
  }

  return new Map(reasons.map(r => [r.name, r.id]))
}

/**
 * Within the given transaction, deletes the exit reasons among `candidateIds`
 * that are no longer linked to any support program. Call after the support
 * program write, in the same transaction.
 *
 * Targeted (only the ids the triggering save could have orphaned) and guarded
 * by `none: {}`, so it never touches a reason another request just created.
 * Same raw-client rationale as resolveExitReasonIds.
 */
export function pruneOrphanedExitReasons(
  tx: Prisma.TransactionClient,
  ctx: SecurityRuleContext,
  candidateIds: string[]
) {
  const ids = [...new Set(candidateIds)]
  if (ids.length === 0) {
    return
  }

  return tx.supportProgramExitReason.deleteMany({
    where: {
      id: { in: ids },
      structureId: ctx.structure.id,
      supportPrograms: { none: {} }
    }
  })
}

/**
 * Deletes the exit reasons of the user's structure that are no longer used by
 * any support program. Structure-global; used by the support program name and
 * beneficiary deletion flows. The update-support-programs flow uses the
 * targeted pruneOrphanedExitReasons instead.
 */
export function deleteUnusedExitReasons(ctx: SecurityRuleContext) {
  return SupportProgramExitReasonRepo.deleteMany(ctx.user, {
    where: { structureId: ctx.structure.id, supportPrograms: { none: {} } }
  })
}
