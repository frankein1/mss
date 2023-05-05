import {
  DefaultLegallyRequiredFollowupType,
  DefaultLegallyNotRequiredFollowupType
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const defaultLegallyRequiredFollowupTypeLabels: {
  [key in DefaultLegallyRequiredFollowupType]: string
} = {
  [DefaultLegallyRequiredFollowupType.AideMedicaleDEtat]:
    "Aide médicale d'État",
  [DefaultLegallyRequiredFollowupType.AideSociale]: 'Aide sociale',
  [DefaultLegallyRequiredFollowupType.AllocationDeSolidariteAuxPersonnesAgees]:
    'Allocation de solidarité aux personnes âgées',
  [DefaultLegallyRequiredFollowupType.AllocationPersonnaliseesDAutonomie]:
    "Allocation personnalisées d'autonomie",
  [DefaultLegallyRequiredFollowupType.ComplementaireSanteSolidaire]:
    'Complémentaire santé solidaire',
  [DefaultLegallyRequiredFollowupType.DemandeDAidesMenageres]:
    "Demande d'aides ménagères",
  [DefaultLegallyRequiredFollowupType.Domiciliation]: 'Domiciliation',
  [DefaultLegallyRequiredFollowupType.EntreeEnEtablissementPourPersonnesHandicapees]:
    'Entrée en établissement pour personnes handicapées',
  [DefaultLegallyRequiredFollowupType.EntreeEnFamilleDAccueil]:
    "Entrée en famille d'accueil",
  [DefaultLegallyRequiredFollowupType.EntreeEnHebergementPourPersonnesAgees]:
    'Entrée en hébergement pour personnes âgées',
  [DefaultLegallyRequiredFollowupType.ObligationAlimentaire]:
    'Obligation alimentaire',
  [DefaultLegallyRequiredFollowupType.Puma]: 'PUMA',
  [DefaultLegallyRequiredFollowupType.RevenuDeSolidariteActive]:
    'Revenu de solidarité active'
}

export const defaultLegallyRequiredFollowupTypeOptions = labelsToOptions(
  defaultLegallyRequiredFollowupTypeLabels
)

export const defaultLegallyNotRequiredFollowupTypeLabels: {
  [key in DefaultLegallyNotRequiredFollowupType]: string
} = {
  [DefaultLegallyNotRequiredFollowupType.AccompagnementSocial]:
    'Accompagnement social',
  [DefaultLegallyNotRequiredFollowupType.AideAlimentaire]: 'Aide alimentaire',
  [DefaultLegallyNotRequiredFollowupType.AideAuTransport]: 'Aide au transport',
  [DefaultLegallyNotRequiredFollowupType.AidesFinancieresNonRemboursables]:
    'Aides financières non remboursables',
  [DefaultLegallyNotRequiredFollowupType.AidesFinancieresRemboursables]:
    'Aides financières remboursables',
  [DefaultLegallyNotRequiredFollowupType.AnimationsFamilles]:
    'Animations familles',
  [DefaultLegallyNotRequiredFollowupType.AnimationsSeniors]:
    'Animations seniors',
  [DefaultLegallyNotRequiredFollowupType.InclusionNumerique]:
    'Inclusion numérique',
  [DefaultLegallyNotRequiredFollowupType.Other]: 'Autre',
  [DefaultLegallyNotRequiredFollowupType.PlanAlerteEtUrgence]:
    'Plan alerte et urgence',
  [DefaultLegallyNotRequiredFollowupType.SoutienAdministratif]:
    'Soutien administratif'
}

export const defaultLegallyNotRequiredFollowupTypeOptions = labelsToOptions(
  defaultLegallyNotRequiredFollowupTypeLabels
)
