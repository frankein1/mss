import { Route } from './routes'
import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export const RouteTitle = {
  [Route.App]: () => 'Accueil',
  [Route.Overview]: () => 'Tableau de bord',

  [Route.Users]: () => 'Gérer les utilisateurs',

  [Route.Stats]: () => 'Statistiques',

  [Route.Account]: () => 'Mon compte',

  [Route.StructureEdit]: () => 'Modifier ma structure',

  [Route.Beneficiaries]: () => 'Bénéficiaires',
  [Route.BeneficiariesAdd]: () => 'Créer un·e bénéficiaire',

  [Route.Beneficiary]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? getBeneficiaryDisplayName(beneficiary) : '',
  [Route.BeneficiaryPrint]: () => 'Imprimer la fiche',
  [Route.BeneficiaryEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary ? `Modifier ${getBeneficiaryDisplayName(beneficiary)}` : '',

  [Route.BeneficiaryFollowupAdd]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Entretien avec ${getBeneficiaryDisplayName(beneficiary)}`
      : 'Entretien avec un·e bénéficiaire',
  [Route.BeneficiaryFollowupEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Modifier l'entretien avec ${getBeneficiaryDisplayName(beneficiary)}`
      : "Modifier l'entretien avec un·e bénéficiaire",

  [Route.BeneficiaryHelpRequestAdd]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Instruction d'une demande d'aide pour ${getBeneficiaryDisplayName(
          beneficiary
        )}`
      : "Instruction d'une demande d'aide",
  [Route.BeneficiaryHelpRequestEdit]: (beneficiary: BeneficiaryNames | null) =>
    beneficiary
      ? `Modifier l'instruction de ${getBeneficiaryDisplayName(beneficiary)}`
      : "Modifier l'instruction d'un·e bénéficiaire",

  [Route.History]: () => 'Accompagnements'
}
