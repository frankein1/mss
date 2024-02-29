export enum EventCategory {
  BeneficiaryFilter = 'Filtre Bénéficiaires',
  BeneficiaryHistoryFilter = "Filtre Historique d'un bénéficiaire",
  FollowupFilter = 'Filtre Entretien',
  HelpRequestFilter = "Filtre Demande d'aide",
  Document = 'Document',
  CreateBeneficiary = 'Créer un bénéficiaire',
  UsersActivity = 'Historique des changements',
  AccessBeneficiaryAdd = 'Accès à Créer un bénéficiaire',
  HistoryQuickEdit = 'Modification dans tableau Accompagnements'
}

export enum BeneficiaryFilterEventAction {
  SocialSupportSubject = "Type d'accompagnement",
  Referent = 'Référent',
  City = 'Ville',
  Status = 'Statut',
  AgeGroup = "Tranche d'âge"
}

export enum BeneficiaryHistoryFilterEventAction {
  TypeSuivi = 'Type de suivi',
  SocialSupportSubject = "Type d'accompagnement",
  Referent = 'Référent'
}

export enum FollowupFilterEventAction {
  Status = 'Statut',
  Medium = "Type d'entretien",
  SocialSupportSubject = "Objet de l'entretien",
  Agent = 'Agent',
  Ministre = 'Ministre'
}

export enum HelpRequestFilterEventAction {
  FileInstructionType = "Type de dossier d'instruction",
  Status = 'Statut',
  SocialSupportSubject = 'Objet de la demande',
  ExaminationDate = 'Date de passage en commission',
  HandlingDate = 'Fin de prise en charge',
  ExternalStructure = 'Instruction',
  Agent = 'Agent',
  Ministre = 'Ministre'
}

export enum DocumentEventAction {
  See = 'Voir',
  Download = 'Télécharger',
  Edit = 'Modifier'
}

export enum CreateBeneficiaryEventAction {
  Complete = 'Compléter',
  SavePartialForm = 'Enregistrer Formulaire partiel',
  SaveCompleteForm = 'Enregistrer Formulaire complet'
}

export enum UserActivityEventAction {
  ExpandBeneficiaries = 'Déplie Bénéficiaires'
}

export enum AccessBeneficiaryAddEventAction {
  FromOverview = 'Depuis Tableau de bord'
}

export enum HistoryQuickEditEventAction {
  FollowupStatus = 'Statut Entretien',
  FileInstructionStatus = 'Statut Instruction de dossier',
  HelpRequestAllocatedAmount = 'Montant alloué Aide financière',
  HelpRequestPaymentMethod = 'Mode de paiement Aide financière',
  HelpRequestPaymentDate = 'Date de paiement Aide financière'
}

export type EventAction =
  | BeneficiaryFilterEventAction
  | BeneficiaryHistoryFilterEventAction
  | FollowupFilterEventAction
  | HelpRequestFilterEventAction
  | DocumentEventAction
  | CreateBeneficiaryEventAction
  | UserActivityEventAction
  | AccessBeneficiaryAddEventAction
  | HistoryQuickEditEventAction

export type MatomoApi = {
  trackEvent: (category: EventCategory, action: EventAction) => void
}
