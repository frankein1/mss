export enum EventCategory {
  BeneficiaryFilter = 'Filtre Bénéficiaires',
  BeneficiaryHistoryFilter = "Filtre Historique d'un bénéficiaire",
  FollowupFilter = 'Filtre Entretien',
  HelpRequestFilter = "Filtre Demande d'aide",
  Document = 'Document',
  CreateBeneficiary = 'Créer un bénéficiaire',
  UsersActivity = 'Historique des changements',
  AccessBeneficiaryAdd = 'Accès à Créer un bénéficiaire',
  ExportHistory = 'Export des accompagnements',
  OverviewToHistory = 'Accès Tableau de bord > Accompagnements'
}

export enum BeneficiaryFilterEventAction {
  SocialSupportSubject = "Type d'accompagnement",
  Referent = 'Référent',
  City = 'Ville',
  Status = 'Statut',
  AgeGroup = "Tranche d'âge",
  VulnerablePerson = 'Registre des personnes vulnérables'
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
  Agent = 'Agent',
  Ministre = 'Ministre',
  RoomCount = 'Nombre de pièces',
  LowIncomeHousingType = 'Logement à loyer modéré'
}

export enum DocumentEventAction {
  See = 'Voir',
  Download = 'Télécharger',
  Edit = 'Modifier',
  Print = 'Imprimer'
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

export enum ExportHistoryEventAction {
  Followups = "Export Synthèses d'entretien",
  FileInstructions = "Export Dossiers d'instruction"
}

export enum OverviewToHistoryEventAction {
  Todo = "Synthèses d'entretien - À traiter",
  InProgress = "Synthèses d'entretien - En cours",
  WaitingAdditionalInformation = "Dossiers d'instruction - En attente de justificatifs",
  InvestigationOngoing = "Dossiers d'instruction - En cours d'instruction"
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
  | ExportHistoryEventAction
  | OverviewToHistoryEventAction

export type MatomoApi = {
  trackEvent: (category: EventCategory, action: EventAction) => void
}
