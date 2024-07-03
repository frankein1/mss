import { Prisma } from '@prisma/client'
import { FamilyFileRepo } from '~/server/database'
import {
  FamilyFilePermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getFamilyFilePermissions
} from '~/server/security'

export function getFamilyFileSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, status: true, structureId: true }
      }
    }
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
