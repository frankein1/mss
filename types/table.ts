import type { Prisma } from '@prisma/client'

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BeneficiarySort = Pick<
  Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput,
  'usualName' | 'firstName'
>

export type FollowupSort = Pick<
  Prisma.FollowupOrderByWithRelationAndSearchRelevanceInput,
  'dueDate' | 'date'
> & {
  beneficiary?: Pick<
    Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput,
    'usualName'
  >
}

export type HelpRequestSort = Pick<
  Prisma.HelpRequestOrderByWithRelationAndSearchRelevanceInput,
  'dueDate' | 'openingDate'
> & {
  beneficiary?: Pick<
    Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput,
    'usualName'
  >
} & {
  instructorOrganization?: Pick<
    Prisma.InstructorOrganizationOrderByWithRelationAndSearchRelevanceInput,
    'name'
  >
}
