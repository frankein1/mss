import { SecurityRuleContext } from '~/server/security'
import { FamilyFileRepo } from '~/server/database'
import { Prisma } from '@prisma/client'

const include: Prisma.FamilyFileInclude = {
  beneficiaries: {
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      birthDate: true,
      relationship: true
    },
    orderBy: { created: 'asc' }
  },
  referents: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true
    }
  }
}

export async function getMinimalInfo({
  ctx: { user },
  input: { id }
}: {
  ctx: SecurityRuleContext
  input: { id: string }
}) {
  return await FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id },
    include
  })
}
