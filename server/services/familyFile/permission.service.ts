import type { Prisma } from '@prisma/client'
import { FamilyFileRepo } from '~~/server/database'
import type {
  FamilyFilePermissions,
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~~/server/security'
import { getFamilyFilePermissions } from '~~/server/security'

const familyFileSecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: {
    select: { id: true, role: true, status: true, structureId: true }
  }
} satisfies Prisma.FamilyFileSelect

export function getFamilyFileSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id },
    select: familyFileSecurityTargetSelect
  })
}

export type FamilyFileSecurityTarget = Prisma.PromiseReturnType<
  typeof getFamilyFileSecurityTarget
>

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<FamilyFilePermissions> {
  const familyFile = await getFamilyFileSecurityTarget(ctx.user, id)
  return getFamilyFilePermissions({
    ctx,
    familyFile
  })
}

export function getCreationPermissions(
  ctx: SecurityRuleContext
): Promise<FamilyFilePermissions> {
  return Promise.resolve(
    getFamilyFilePermissions({
      ctx
    })
  )
}

/**
 * Authorizes a referent change (add/remove) across many family files at once.
 */
export async function validateCanChangeReferents(
  ctx: SecurityRuleContext,
  familyFileIds: string[]
): Promise<boolean> {
  const uniqueIds = [...new Set(familyFileIds)]
  if (uniqueIds.length === 0) {
    return true
  }

  const familyFiles = await FamilyFileRepo.findMany(ctx.user, {
    where: { id: { in: uniqueIds } },
    select: familyFileSecurityTargetSelect
  })
  // **All** family files must validate the structure and referent scope from the Repo
  if (familyFiles.length !== uniqueIds.length) {
    return false
  }

  return familyFiles.every(
    familyFile => getFamilyFilePermissions({ ctx, familyFile }).changeReferent
  )
}
