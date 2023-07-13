import type { Prisma } from '@prisma/client'

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BeneficiarySort = {
  usualName?: Prisma.SortOrder
  firstName?: Prisma.SortOrder
}

export type FollowupSort = {
  dueDate?: Prisma.SortOrder
  date?: Prisma.SortOrder
  beneficiary?: {
    usualName?: Prisma.SortOrder
  }
}

export type HelpRequestSort = {
  dueDate?: Prisma.SortOrder
  openingDate?: Prisma.SortOrder
  beneficiary?: {
    usualName?: Prisma.SortOrder
  }
  instructorOrganization?: {
    name?: Prisma.SortOrder
  }
}
