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
  OverviewToHistory = 'Accès Tableau de bord > Accompagnements',
  History = 'Historique',
  Beneficiary = 'Beneficiaire',
  ExportStats = 'Export des statistiques',
  ExportBudget = 'Export du budget',
  BeneficiaryArchive = 'Archive Bénéficiaire',
  FamilyFile = 'Dossier Foyer'
}

export enum FamilyFileAction {
  CreateBeneficiary = 'Créer un bénéficiaire',
  LinkBeneficiary = 'Lier un bénéficiaire'
}

export enum BeneficiaryFilterEventAction {
  SocialSupportSubject = "Type d'accompagnement",
  Referent = 'Référent',
  City = 'Ville',
  Status = 'Statut',
  AgeGroup = "Tranche d'âge",
  VulnerablePerson = 'Registre des personnes vulnérables',
  NotFilled = 'Champ non renseigné',
  QPV = 'Quartier prioritaire de la politique de la ville'
}

export enum BeneficiaryHistoryAction {
  Print = 'Imprimer',
  PrintAllHelpRequest = 'Imprimer - Instruction de dossier',
  PrintFinancialHelpRequest = 'Imprimer - Instruction de dossier - Aide financière',
  PrintHousingHelpRequest = 'Imprimer - Instruction de dossier -Demande de logement',
  PrintOtherHelpRequest = 'Imprimer - Instruction de dossier - Autre',
  PrintFollowup = "Imprimer - Synthèse d'entretien",
  PlanAppointment = 'Prendre rendez-vous pour un bénéficiaire',
  UpdateAppointment = 'Modifier le rendez-vous dans RDV Service Public'
}

export enum BeneficiaryAction {
  Print = 'Imprimer',
  Split = 'Dissocier'
}

export enum BeneficiaryHistoryFilterEventAction {
  TypeSuivi = 'Type de suivi',
  SocialSupportSubject = "Type d'accompagnement",
  Referent = 'Référent',
  InvolvedBeneficiary = 'Bénéficiaire concerné'
}

export enum BeneficiaryArchiveAction {
  ExportArchive = "Export de l'archive",
  DeleteWithoutArchive = 'Suppression sans archive',
  DeleteWithArchiveAndKeepName = 'Suppression avec archive et conservation du nom',
  DeleteWithArchive = 'Suppression avec archive sans conservation du nom',
  DelayArchive = 'Conserver 1 an supplémentaire'
}

export enum FollowupFilterEventAction {
  Status = 'Statut',
  Medium = "Type d'entretien",
  SocialSupportSubject = "Objet de l'entretien",
  Agent = 'Agent',
  Period = 'Période',
  Ministre = 'Ministre',
  NotFilled = 'Champ non renseigné'
}

export enum HelpRequestFilterEventAction {
  FileInstructionType = "Type de dossier d'instruction",
  Status = 'Statut',
  SocialSupportSubject = 'Objet de la demande',
  ExaminationDate = 'Date de passage en commission',
  Agent = 'Agent',
  Ministre = 'Ministre',
  RoomCount = 'Nombre de pièces',
  LowIncomeHousingType = 'Logement à loyer modéré',
  NotFilled = 'Champ non renseigné'
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

export enum ExportHistoryEventAction {
  Followups = "Export Synthèses d'entretien",
  FileInstructions = "Export Dossiers d'instruction"
}

export enum OverviewToHistoryEventAction {
  Todo = "Synthèses d'entretien - À traiter",
  InProgress = "Synthèses d'entretien - En cours",
  WaitingAdditionalInformation = "Dossiers d'instruction - En attente de justificatifs",
  InvestigationOngoing = "Dossiers d'instruction - En cours d'instruction",
  RdvSeen = 'Rendez-vous - Honoré',
  RdvNoShow = 'Rendez-vous - Absence non excusée',
  RdvExcused = "Rendez-vous - Annulé à l'initiative de l'usager",
  RdvRevoked = "Rendez-vous - Annulé à l'initiative du service",
  RdvUnknown = 'Rendez-vous - Inconnu'
}

export enum ExportEventAction {
  DownloadImages = 'Export en images',
  DownloadExcel = "Export d'un document Excel"
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
  | BeneficiaryHistoryAction
  | BeneficiaryAction
  | ExportEventAction
  | BeneficiaryArchiveAction
  | FamilyFileAction

export type MatomoApi = {
  trackEvent: (category: EventCategory, action: EventAction) => void
}
