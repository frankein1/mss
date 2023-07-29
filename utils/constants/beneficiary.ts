export enum BeneficiaryTab {
  Details = 'Details',
  Documents = 'Documents',
  History = 'History'
}

export const BENEFICIARY_RELATIONS_INCLUDE = {
  referents: true,
  relatives: {
    include: {
      linkedBeneficiary: true
    }
  },
  documents: true,
  followups: {
    include: {
      types: true
    }
  },
  helpRequests: {
    include: {
      type: true
    }
  }
}
