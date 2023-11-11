export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BeneficiarySort = {
  usualName?: SortOrder
  firstName?: SortOrder
  birthDate?: SortOrder
}

export type BeneficiaryDocumentSort = {
  name?: SortOrder
  created?: SortOrder
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

export type StructureAdminSort = {
  beneficiaries?: { _count?: SortOrder }
  lastActivity?: SortOrder
}

export type UserAdminSort = {
  lastAccess?: SortOrder
}

export type TableSort =
  | BeneficiarySort
  | FollowupSort
  | HelpRequestSort
  | StructureAdminSort
  | UserAdminSort
  | BeneficiaryDocumentSort
