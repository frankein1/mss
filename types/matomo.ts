export enum EventCategory {
  BeneficiaryFilter = 'Filtre Bénéficiaires',
  BeneficiaryHistoryFilter = "Filtre Historique d'un bénéficiaire",
  FollowupFilter = 'Filtre Entretien',
  HelpRequestFilter = "Filtre Demande d'aide",
  Document = 'Document',
  CreateBeneficiary = 'Créer un bénéficiaire',
  UsersActivity = 'Historique des changements'
}

export enum BeneficiaryFilterEventAction {
  FollowupType = "Type d'accompagnement",
  Referent = 'Référent',
  City = 'Ville',
  Status = 'Statut',
  AgeGroup = "Tranche d'âge"
}

export enum BeneficiaryHistoryFilterEventAction {
  TypeSuivi = 'Type de suivi',
  FollowupType = "Type d'accompagnement"
}

export enum FollowupFilterEventAction {
  Status = 'Statut',
  Medium = "Type d'entretien",
  FollowupType = "Objet de l'entretien",
  Referent = 'Référent',
  Ministre = 'Ministre'
}

export enum HelpRequestFilterEventAction {
  Status = 'Statut',
  FollowupType = 'Objet de la demande',
  ExaminationDate = 'Date de passage en commission',
  HandlingDate = 'Fin de prise en charge',
  ExternalStructure = 'Instruction',
  Referent = 'Référent',
  Ministre = 'Ministre'
}

export enum DocumentEventAction {
  See = 'Voir',
  Download = 'Télécharger'
}

export enum CreateBeneficiaryEventAction {
  Complete = 'Compléter',
  SavePartialForm = 'Enregistrer Formulaire partiel',
  SaveCompleteForm = 'Enregistrer Formulaire complet'
}

export enum UserActivityEventAction {
  ExpandBeneficiaries = 'Déplie Bénéficiaires'
}

export type EventAction =
  | BeneficiaryFilterEventAction
  | BeneficiaryHistoryFilterEventAction
  | FollowupFilterEventAction
  | HelpRequestFilterEventAction
  | DocumentEventAction
  | CreateBeneficiaryEventAction
  | UserActivityEventAction

export type MatomoApi = {
  trackEvent: (category: EventCategory, action: EventAction) => void
}
