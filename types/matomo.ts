export enum EventCategory {
  BeneficiaryFilter = 'Filtre Bénéficiaires'
}

export enum BeneficiaryFilterEventAction {
  FollowupType = "Type d'accompagnement",
  Referent = 'Référent',
  City = 'Ville',
  Status = 'Statut',
  AgeGroup = "Tranche d'âge"
}

export type EventAction = BeneficiaryFilterEventAction

export type MatomoApi = {
  trackEvent: (category: EventCategory, action: EventAction) => void
}
