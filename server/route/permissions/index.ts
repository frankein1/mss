export * from './get-followup-permission'
export * from './get-helprequest-permission'
export * from './get-beneficiary-permission'

export type UserPermissions = {
  helpRequests: {
    allColumns: boolean
  }
}

export type BeneficiaryHistoryItemPermissions = {
  followup: {
    //   canViewFollowupDetails,
    //   canViewFollowupPrivateSynthesis,
    //   canEditFollowup,
    //   canDeleteFollowup,
    edit: boolean
    delete: boolean
    viewDetails: boolean
    viewPrivateSynthesis: boolean
  }
  comment: {
    //   canListComments as canListCommentsRule,
    list: boolean
  }
  helpRequest: {
    viewDetails: boolean
    delete: boolean
    edit: boolean
    viewPrivateSynthesis: boolean
    //   canViewHelpRequestDetails,
    //   canDeleteHelpRequest,
    //   canEditHelpRequest,
    //   canViewHelpRequestPrivateSynthesis
  }
}

export type HelpRequestItemPermissions = {
  edit: boolean
  viewDetails: boolean
}

export type HelpRequestPermissions = {
  actions: {
    edit: boolean
    delete: boolean
    editStructure: boolean
    createPrescribingOrga: boolean
    createInstructorOrga: boolean
  }
  fields: {
    numeroPegase: boolean
    ministre: boolean
    privateSynthesis: boolean
  }
}

export type FollowupPermissions = {
  actions: {
    create: boolean
    edit: boolean
    delete: boolean
    editStructure: boolean
    createPrescribingOrga: boolean
  }
  fields: {
    numeroPegase: boolean
    ministre: boolean
    classified: boolean
    forwardedToJustice: boolean
    interventions: boolean
    signalements: boolean
    privateSynthesis: boolean
  }
}
