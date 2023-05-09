import { DefaultFollowupType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const defaultLegallyRequiredFollowupTypeLabels: {
  [key in DefaultFollowupType]?: string
} = {
  [DefaultFollowupType.AideMedicaleDEtat]: "Aide médicale d'État",
  [DefaultFollowupType.AideSociale]: 'Aide sociale',
  [DefaultFollowupType.AllocationDeSolidariteAuxPersonnesAgees]:
    'Allocation de solidarité aux personnes âgées',
  [DefaultFollowupType.AllocationPersonnaliseesDAutonomie]:
    "Allocation personnalisées d'autonomie",
  [DefaultFollowupType.ComplementaireSanteSolidaire]:
    'Complémentaire santé solidaire',
  [DefaultFollowupType.DemandeDAidesMenageres]: "Demande d'aides ménagères",
  [DefaultFollowupType.Domiciliation]: 'Domiciliation',
  [DefaultFollowupType.EntreeEnEtablissementPourPersonnesHandicapees]:
    'Entrée en établissement pour personnes handicapées',
  [DefaultFollowupType.EntreeEnFamilleDAccueil]: "Entrée en famille d'accueil",
  [DefaultFollowupType.EntreeEnHebergementPourPersonnesAgees]:
    'Entrée en hébergement pour personnes âgées',
  [DefaultFollowupType.ObligationAlimentaire]: 'Obligation alimentaire',
  [DefaultFollowupType.Puma]: 'PUMA',
  [DefaultFollowupType.RevenuDeSolidariteActive]: 'Revenu de solidarité active'
}

export const defaultLegallyRequiredFollowupTypeOptions = labelsToOptions(
  defaultLegallyRequiredFollowupTypeLabels
)

export const defaultLegallyNotRequiredFollowupTypeLabels: {
  [key in DefaultFollowupType]?: string
} = {
  [DefaultFollowupType.AccompagnementSocial]: 'Accompagnement social',
  [DefaultFollowupType.AideAlimentaire]: 'Aide alimentaire',
  [DefaultFollowupType.AideAuTransport]: 'Aide au transport',
  [DefaultFollowupType.AidesFinancieresNonRemboursables]:
    'Aides financières non remboursables',
  [DefaultFollowupType.AidesFinancieresRemboursables]:
    'Aides financières remboursables',
  [DefaultFollowupType.AnimationsFamilles]: 'Animations familles',
  [DefaultFollowupType.AnimationsSeniors]: 'Animations seniors',
  [DefaultFollowupType.InclusionNumerique]: 'Inclusion numérique',
  [DefaultFollowupType.Other]: 'Autre',
  [DefaultFollowupType.PlanAlerteEtUrgence]: 'Plan alerte et urgence',
  [DefaultFollowupType.SoutienAdministratif]: 'Soutien administratif'
}

export const defaultLegallyNotRequiredFollowupTypeOptions = labelsToOptions(
  defaultLegallyNotRequiredFollowupTypeLabels
)
