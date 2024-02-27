import { DefaultFollowupType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const defaultLegallyRequiredFollowupTypeLabels: {
  [key in DefaultFollowupType]?: string
} = {
  [DefaultFollowupType.AideSociale]: 'Aide sociale',
  [DefaultFollowupType.AideMedicaleDEtat]: "Aide médicale d'État - AME",
  [DefaultFollowupType.AllocationDeSolidariteAuxPersonnesAgees]:
    'Allocation de solidarité aux personnes âgées',
  [DefaultFollowupType.AllocationPersonnaliseesDAutonomie]:
    "Allocation personnalisées d'autonomie",
  [DefaultFollowupType.ComplementaireSanteSolidaire]:
    'Complémentaire santé solidaire',
  [DefaultFollowupType.DemandeDAidesMenageres]: "Demande d'aides ménagères",
  [DefaultFollowupType.Domiciliation]: 'Domiciliation',
  [DefaultFollowupType.EntreeEnFamilleDAccueil]: "Entrée en famille d'accueil",
  [DefaultFollowupType.EntreeEnHebergementPourPersonnesAgees]:
    'Entrée en hébergement pour personnes âgées',
  [DefaultFollowupType.EntreeEnEtablissementPourPersonnesHandicapees]:
    'Entrée en établissement pour personnes handicapées',
  [DefaultFollowupType.ObligationAlimentaire]: 'Obligation alimentaire',
  [DefaultFollowupType.Puma]: 'PUMA',
  [DefaultFollowupType.RevenuDeSolidariteActive]:
    'Revenu de Solidarité Active - RSA'
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
  [DefaultFollowupType.AnimationsFamilles]: 'Animations familles',
  [DefaultFollowupType.AnimationsSeniors]: 'Animations seniors',
  [DefaultFollowupType.CAP]: 'CAP',
  [DefaultFollowupType.InclusionNumerique]: 'Inclusion numérique',
  [DefaultFollowupType.PlanAlerteEtUrgence]:
    'Plan alerte et protection des personnes',
  [DefaultFollowupType.SoutienAdministratif]: 'Soutien administratif',
  [DefaultFollowupType.SoutienCreationActivite]:
    "Soutien à la création d'activité",
  [DefaultFollowupType.DossierFSL]: 'Dossier FSL',
  [DefaultFollowupType.AideChauffage]: 'Aide chauffage',
  [DefaultFollowupType.AideImpayesEnergieFluides]:
    "Aide aux impayés d'énergie et fluides"
}

export const defaultLegallyNotRequiredFollowupTypeOptions = labelsToOptions(
  defaultLegallyNotRequiredFollowupTypeLabels
)
