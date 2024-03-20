import { DefaultSocialSupportSubject } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const socialSupportSubjectKeys = buildKeys({
  [DefaultSocialSupportSubject.AideSociale]: 'Aide sociale',
  [DefaultSocialSupportSubject.AideMedicaleDEtat]: "Aide médicale d'État - AME",
  [DefaultSocialSupportSubject.AllocationDeSolidariteAuxPersonnesAgees]:
    'Allocation de solidarité aux personnes âgées',
  [DefaultSocialSupportSubject.AllocationPersonnaliseesDAutonomie]:
    "Allocation personnalisées d'autonomie",
  [DefaultSocialSupportSubject.ComplementaireSanteSolidaire]:
    'Complémentaire santé solidaire',
  [DefaultSocialSupportSubject.DemandeDAidesMenageres]:
    "Demande d'aides ménagères",
  [DefaultSocialSupportSubject.Domiciliation]: 'Domiciliation',
  [DefaultSocialSupportSubject.EntreeEnFamilleDAccueil]:
    "Entrée en famille d'accueil",
  [DefaultSocialSupportSubject.EntreeEnHebergementPourPersonnesAgees]:
    'Entrée en hébergement pour personnes âgées',
  [DefaultSocialSupportSubject.EntreeEnEtablissementPourPersonnesHandicapees]:
    'Entrée en établissement pour personnes handicapées',
  [DefaultSocialSupportSubject.ObligationAlimentaire]: 'Obligation alimentaire',
  [DefaultSocialSupportSubject.Puma]: 'PUMA',
  [DefaultSocialSupportSubject.RevenuDeSolidariteActive]:
    'Revenu de Solidarité Active - RSA',
  [DefaultSocialSupportSubject.AccompagnementSocial]: 'Accompagnement social',
  [DefaultSocialSupportSubject.AideAlimentaire]: 'Aide alimentaire',
  [DefaultSocialSupportSubject.AideAuTransport]: 'Aide au transport',
  [DefaultSocialSupportSubject.AnimationsFamilles]: 'Animations familles',
  [DefaultSocialSupportSubject.AnimationsSeniors]: 'Animations seniors',
  [DefaultSocialSupportSubject.CAP]: 'CAP',
  [DefaultSocialSupportSubject.InclusionNumerique]: 'Inclusion numérique',
  [DefaultSocialSupportSubject.PlanAlerteEtUrgence]:
    'Plan alerte et protection des personnes',
  [DefaultSocialSupportSubject.SoutienAdministratif]: 'Soutien administratif',
  [DefaultSocialSupportSubject.SoutienCreationActivite]:
    "Soutien à la création d'activité",
  [DefaultSocialSupportSubject.DossierFSL]: 'Dossier FSL',
  [DefaultSocialSupportSubject.AideChauffage]: 'Aide chauffage',
  [DefaultSocialSupportSubject.AideImpayesEnergieFluides]:
    "Aide aux impayés d'énergie et fluides"
})
