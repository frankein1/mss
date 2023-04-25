import { Prisma } from '@prisma/client'
import { sum } from '~/utils/sum'
import { prismaClient } from '~/server/prisma'

export const getGenderStats = async (structureId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      structureId
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } }
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type GetGenderStatsReturn = Prisma.PromiseReturnType<
  typeof getGenderStats
>
