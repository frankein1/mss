export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BeneficiarySort = {
  usualName?: SortOrder
  firstName?: SortOrder
  birthDate?: { sort: SortOrder; nulls: 'last' }
}

export type BeneficiaryDocumentSort = {
  name?: SortOrder
  created?: SortOrder
}

export type FollowupSort = {
  socialSupport: {
    dueDate?: SortOrder
    date?: SortOrder
    beneficiary?: {
      usualName?: SortOrder
    }
  }
}

export type FileInstructionSort = {
  socialSupport?: {
    date?: SortOrder
    beneficiary?: {
      usualName?: SortOrder
    }
  }
}

export type StructureAdminSort = {
  beneficiaries?: { _count?: SortOrder }
  lastActivity?: SortOrder
}

export type UserAdminSort = {
  lastAccess?: SortOrder
}

export type EmailAdminSort = {
  sentDate?: SortOrder
}

export type TableSort =
  | BeneficiarySort
  | FollowupSort
  | FileInstructionSort
  | StructureAdminSort
  | UserAdminSort
  | BeneficiaryDocumentSort
  | EmailAdminSort
