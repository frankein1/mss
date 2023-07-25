import { Route } from './routes'
import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export const RouteTitle = {
  [Route.CGUManager]: () => "Conditions générales d'utilisation",
  [Route.DeclarationAccessibilite]: () => "Déclaration d'accessibilité",
  [Route.MentionsLegales]: () => 'Mentions légales',
  [Route.Register]: () => 'Enregistrer ma structure',

  // AUTH
  [Route.AuthAdmin]: () => "Se connecter à l'espace d'administration",
  [Route.AuthLogin]: () => 'Se connecter à ma structure',
  [Route.AuthLogout]: () => 'Vous êtes déconnecté·e·s',
  [Route.AuthValidateToken]: () => 'Jeton en cours de vérification',

  // ERROR
  [Route.ErrorDisabledAccount]: () => 'Votre compte est désactivé',
  [Route.ErrorUnknownUser]: () =>
    "Votre compte InclusionConnect n'est pas rattaché",

  // APP
  [Route.App]: () => 'Mon espace',
  [Route.AppOverview]: () => 'Tableau de bord',
  [Route.AppUsers]: () => 'Gérer les utilisateurs',
  [Route.AppStats]: () => 'Statistiques',
  [Route.AppAccount]: () => 'Mon compte',
  [Route.AppStructureEdit]: () => 'Modifier ma structure',
  [Route.AppBeneficiaries]: () => 'Bénéficiaires',
  [Route.AppBeneficiariesAdd]: () => 'Créer un·e bénéficiaire',
  [Route.AppBeneficiary]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? getBeneficiaryDisplayName(beneficiary) : '',
  [Route.AppBeneficiaryPrint]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Imprimer la fiche de ${getBeneficiaryDisplayName(beneficiary)}`
      : '',
  [Route.AppBeneficiaryEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? `Modifier ${getBeneficiaryDisplayName(beneficiary)}` : '',
  [Route.AppBeneficiaryFollowupAdd]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Entretien avec ${getBeneficiaryDisplayName(beneficiary)}`
      : 'Entretien avec un·e bénéficiaire',
  [Route.AppBeneficiaryFollowupEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Modifier l'entretien avec ${getBeneficiaryDisplayName(beneficiary)}`
      : "Modifier l'entretien avec un·e bénéficiaire",
  [Route.AppBeneficiaryHelpRequestAdd]: (
    beneficiary: BeneficiaryNames | null
  ) =>
    beneficiary
      ? `Instruction d'une demande d'aide pour ${getBeneficiaryDisplayName(
          beneficiary
        )}`
      : "Instruction d'une demande d'aide",
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiary: BeneficiaryNames | null
  ) =>
    beneficiary
      ? `Modifier l'instruction de ${getBeneficiaryDisplayName(beneficiary)}`
      : "Modifier l'instruction d'un·e bénéficiaire",

  [Route.AppHistory]: () => 'Accompagnements',

  // ADMIN
  [Route.Admin]: () => "Mon espace d'administration",
  [Route.AdminOverview]: () => 'Tableau de bord'
}
