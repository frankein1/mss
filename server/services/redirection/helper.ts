import { prismaClient } from '~/server/prisma'
import { RedirectionReasonRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'

type WithReasonName = { redirectionReasonName?: string | null }

/**
 * Ensures every redirection reason name referenced by the given redirections
 * exists for the user's structure (creating new ones on the fly), and returns
 * a `name -> id` map.
 *
 * The redirection form lets users either pick an existing RedirectionReason or
 * type a new one, so reasons are resolved with a find-or-create (upsert) scoped
 * to the structure, mirroring how workshop names are handled.
 */
export async function resolveRedirectionReasonIds(
  ctx: SecurityRuleContext,
  redirections: WithReasonName[] | null | undefined
): Promise<Map<string, string>> {
  const names = [
    ...new Set(
      (redirections ?? [])
        .map(r => r.redirectionReasonName?.trim())
        .filter((name): name is string => !!name)
    )
  ]

  if (names.length === 0) {
    return new Map()
  }

  const structureId = ctx.structure.id
  const reasons = await prismaClient.$transaction(
    names.map(name =>
      RedirectionReasonRepo.prisma.upsert({
        where: { structureId_name: { structureId, name } },
        update: {},
        create: { name, structureId, createdById: ctx.user.id },
        select: { id: true, name: true }
      })
    )
  )

  return new Map(reasons.map(r => [r.name, r.id]))
}

/** Resolves a single redirection reason name to its id using a resolved map. */
export function resolveReasonId(
  reasonIds: Map<string, string>,
  redirectionReasonName: string | null | undefined
): string | null {
  const name = redirectionReasonName?.trim()
  return name ? (reasonIds.get(name) ?? null) : null
}

/**
 * Deletes RedirectionReason records that are no longer referenced by any
 * SocialSupportRedirection. Call this after deleting redirections.
 */
export async function deleteOrphanedRedirectionReasons(
  reasonIds: (string | null | undefined)[]
): Promise<void> {
  const ids = [...new Set(reasonIds.filter((id): id is string => !!id))]
  if (ids.length === 0) {
    return
  }
  await prismaClient.redirectionReason.deleteMany({
    where: {
      id: { in: ids },
      socialSupportRedirections: { none: {} }
    }
  })
}
