import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  AllowSecurityCheck,
  SecurityRuleContext
} from '~/server/security/rules/types'
import { StructureRepo, WorkshopRepo } from '~/server/database'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import z from 'zod'

const getWorkshopsSchema = z.object({
  filter: z.object({
    passed: z.boolean()
  }),
  perPage: z.number(),
  page: z.number()
})

const handler = async ({
  input,
  ctx
}: {
  input: GetWorkshopsInput
  ctx: ProtectedAppContext
}) => {
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id: ctx.structure.id
    },
    select: {
      id: true
    }
  })

  const where = {
    structureId: structure.id,
    ...getDateFilter(input.filter.passed)
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const [items, count] = await Promise.all([
    getWorkshops(ctx, { where, take, skip }),
    WorkshopRepo.count(ctx.user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}

export const getPageQuery = createQuery({
  inputValidation: getWorkshopsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})

type WorkshopsPage = Prisma.PromiseReturnType<typeof handler>
export type WorkshopsPageItems = WorkshopsPage['items']
export type WorkshopsPageItem = WorkshopsPageItems[0]

type GetWorkshopsInput = {
  filter: GetWorkshopsPageFilter
  perPage: number
  page: number
}

type GetWorkshopsPageFilter = {
  passed: boolean
}

const getWorkshops = async (ctx: SecurityRuleContext, args: any) => {
  return await WorkshopRepo.findMany(ctx.user, {
    where: args.where,
    take: args.take,
    skip: args.skip,
    orderBy: {
      date: args.filterpassed ? 'asc' : 'desc'
    }
  })
}

// TODO: test this
const getDateFilter = (passed: boolean) => {
  return passed
    ? {
        date: {
          lte: new Date()
        }
      }
    : {
        date: {
          gt: new Date()
        }
      }
}
