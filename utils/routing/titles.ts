import { Route } from './routes'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export const RouteTitle = {
  [Route.CGUManager]: () => "Conditions générales d'utilisation",
  [Route.DeclarationAccessibilite]: () => "Déclaration d'accessibilité",
  [Route.MentionsLegales]: () => 'Mentions légales',
  [Route.PolitiqueConfidentialite]: () => 'Politique de confidentialité',
  [Route.Register]: () => 'Enregistrer ma structure',
  [Route.Statistiques]: () => "Statistiques d'utilisation",

  // AUTH
  [Route.AuthAdmin]: () => "Se connecter à l'espace d'administration",
  [Route.AuthLogin]: () => 'Se connecter à ma structure',
  [Route.AuthLogout]: () => 'Vous avez été déconnecté·e',
  [Route.AuthValidateToken]: () => 'Jeton en cours de vérification',

  // ERROR
  [Route.ErrorDisabledAccount]: () => 'Votre compte est désactivé',
  [Route.ErrorUnknownUser]: () =>
    "Votre compte InclusionConnect n'est pas rattaché",

  // APP
  [Route.App]: () => 'Mon espace',
  [Route.AppOverview]: () => 'Tableau de bord',
  [Route.AppUsers]: () => 'Gérer les utilisateurs',
  [Route.AppPartners]: () => 'Annuaire des partenaires',
  [Route.AppStats]: () => 'Statistiques',
  [Route.AppAccount]: () => 'Mon compte',
  [Route.AppStructure]: () => 'Configurer votre structure',
  [Route.AppStructureEdit]: () => 'Modifier ma structure',
  [Route.AppStructureSubjects]: () => 'Ajouter un accompagnement',
  [Route.AppBeneficiaries]: () => 'Bénéficiaires',
  [Route.AppBeneficiariesAdd]: () => 'Créer un·e bénéficiaire',
  [Route.AppBeneficiary]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? formatBeneficiaryDisplayName(beneficiary) : '',
  [Route.AppBeneficiaryPrint]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Imprimer la fiche de ${formatBeneficiaryDisplayName(beneficiary)}`
      : '',
  [Route.AppFileBudgetInfoEdit]: () =>
    'Modifier les informations générales du budget',
  [Route.AppFileBudgetExpensesEdit]: () =>
    'Modifier les charges fixes mensuelles',
  [Route.AppBeneficiaryBudgetIncomeEdit]: () => 'Modifier les revenus mensuels',
  [Route.AppBeneficiaryEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? `Modifier ${formatBeneficiaryDisplayName(beneficiary)}` : '',
  [Route.AppBeneficiaryEditInfo]: () => 'Informations bénéficiaire',
  [Route.AppBeneficiaryEditTaxHousehold]: () => 'Foyer fiscal',
  [Route.AppBeneficiaryEditEntourage]: () => 'Entourage',
  [Route.AppBeneficiaryEditHealth]: () => 'Santé',
  [Route.AppBeneficiaryEditOccupation]: () => 'Activité',
  [Route.AppBeneficiaryEditExternalOrganisations]: () =>
    'Structures extérieures',
  [Route.AppBeneficiaryFollowupAdd]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
      : 'Entretien avec un·e bénéficiaire',
  [Route.AppBeneficiaryFollowupEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Modifier l'entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
      : "Modifier l'entretien avec un·e bénéficiaire",
  [Route.AppBeneficiaryHelpRequestAdd]: (
    beneficiary: BeneficiaryNames | null
  ) =>
    beneficiary
      ? `Instruction d'un dossier pour ${formatBeneficiaryDisplayName(
          beneficiary
        )}`
      : "Instruction d'un dossier",
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiary: BeneficiaryNames | null
  ) =>
    beneficiary
      ? `Modifier l'instruction de dossier ${formatBeneficiaryDisplayName(
          beneficiary
        )}`
      : "Modifier l'instruction de dossier d'un·e bénéficiaire",

  [Route.AppHistory]: () => 'Accompagnements',
  [Route.AppHistoryPrint]: () => 'Imprimer la fiche',

  // ADMIN
  [Route.Admin]: () => "Mon espace d'administration",
  [Route.AdminOverview]: () => 'Tableau de bord'
}
