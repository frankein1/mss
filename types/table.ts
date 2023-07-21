export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BeneficiarySort = {
  usualName?: SortOrder
  firstName?: SortOrder
}

export type FollowupSort = {
  dueDate?: SortOrder
  date?: SortOrder
  beneficiary?: {
    usualName?: SortOrder
  }
}

export type HelpRequestSort = {
  dueDate?: SortOrder
  openingDate?: SortOrder
  beneficiary?: {
    usualName?: SortOrder
  }
  instructorOrganization?: {
    name?: SortOrder
  }
}

export type TableSort = BeneficiarySort | FollowupSort | HelpRequestSort
