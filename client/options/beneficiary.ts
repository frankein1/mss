import {
  BeneficiaryAccommodationZone,
  BeneficiaryAccommodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
  IncomeSource,
  RelativeRelationship,
  BeneficiaryPensionOrganisation,
  BeneficiaryVulnerablePersonType
} from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'
import { labelsToOptions } from '~/utils/options'

export const pensionOrganisationLabels: {
  [key in BeneficiaryPensionOrganisation]: string
} = {
  AgircArrco: 'AGIRC ARRCO',
  Agr: 'AG2R',
  CnavCarsat: 'CNAV/CARSAT',
  Cipav: 'CIPAV',
  Cnracl: 'CNRACL',
  Edf: 'EDF',
  Ircantec: 'IRCANTEC',
  Klesia: 'KLESIA',
  Sre: 'SRE',
  Ssi: 'SSI (ex-RSI)',
  MalakoffHumanis: 'Malakoff Humanis',
  Msa: 'MSA',
  ProBtp: 'ProBTP',
  RetraiteDesMines: 'Retraite des mines',
  Other: 'Autre(s)'
}
export const pensionOrganisationOptions = labelsToOptions(
  pensionOrganisationLabels
)

export const beneficiaryStatusLabels: { [key in BeneficiaryStatus]: string } = {
  [BeneficiaryStatus.Active]: 'Actif',
  [BeneficiaryStatus.Inactive]: 'Inactif',
  [BeneficiaryStatus.Archived]: 'Archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e'
}

export const beneficiaryStatusDetailedLabels: {
  [key in BeneficiaryStatus]: string
} = {
  [BeneficiaryStatus.Active]: 'Dossier actif',
  [BeneficiaryStatus.Inactive]: 'Dossier inactif',
  [BeneficiaryStatus.Archived]: 'Dossier archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e'
}

export const beneficiaryStatusOptions = labelsToOptions(beneficiaryStatusLabels)

export const beneficiaryVulnerablePersonTypeLabels: { [key in BeneficiaryVulnerablePersonType]: string } = {
  [BeneficiaryVulnerablePersonType.PersonneIsolee]: 'Personne isolée',
  [BeneficiaryVulnerablePersonType.PlanAlerteEtUrgence]: 'Plan d\'alerte et d\'urgence',
  [BeneficiaryVulnerablePersonType.PlanCommunalSauvegarde]: 'Plan communal de sauvegarde',
  [BeneficiaryVulnerablePersonType.Other]: 'Autre'
}

export const beneficiaryVulnerablePersonTypeOptions = labelsToOptions(beneficiaryVulnerablePersonTypeLabels)

export const beneficiaryTitleLabels: { [key in BeneficiaryTitle]: string } = {
  [BeneficiaryTitle.Miss]: 'Mme.',
  [BeneficiaryTitle.Mister]: 'M.'
}

export const BeneficiaryTitleKeys = buildKeys(beneficiaryTitleLabels)

export const beneficiaryTitleOptions = labelsToOptions(beneficiaryTitleLabels)

export const beneficiaryGenderLabels: { [key in Gender]: string } = {
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre'
}

export const BeneficiaryGenderKeys = buildKeys(beneficiaryGenderLabels)

export const beneficiaryGenderOptions = labelsToOptions(beneficiaryGenderLabels)

export const beneficiaryFamilySituationLabels: {
  [key in BeneficiaryFamilySituation]: string
} = {
  [BeneficiaryFamilySituation.Single]: 'Célibataire',
  [BeneficiaryFamilySituation.Divorced]: 'Divorcé·e',
  [BeneficiaryFamilySituation.Cohabitation]: 'En concubinage',
  [BeneficiaryFamilySituation.CoupleWithChildren]: 'En couple avec enfant(s)',
  [BeneficiaryFamilySituation.Married]: 'Marié·e',
  [BeneficiaryFamilySituation.CivilUnion]: 'Pacsé·e',
  [BeneficiaryFamilySituation.SingleParentWithChildren]:
    'Parent isolé·e avec enfant(s)',
  [BeneficiaryFamilySituation.Separated]: 'Séparé·e',
  [BeneficiaryFamilySituation.Widow]: 'Veuf·ve',
  [BeneficiaryFamilySituation.Other]: 'Autre'
}

export const BeneficiaryFamilySituationKeys = buildKeys(
  beneficiaryFamilySituationLabels
)

export const beneficiaryFamilySituationOptions = labelsToOptions(
  beneficiaryFamilySituationLabels
)

export const beneficiaryMobilityLabels: {
  [key in BeneficiaryMobility]: string
} = {
  [BeneficiaryMobility.None]: 'Aucun moyen de transport à disposition',
  [BeneficiaryMobility.Code]: 'Code obtenu',
  [BeneficiaryMobility.PublicTransport]: 'Dépendant des transports en commun',
  [BeneficiaryMobility.PermitWithVehicle]:
    'Permis B avec véhicule (voiture, moto, scooter)',
  [BeneficiaryMobility.PermitWithoutVehicle]: 'Permis B sans véhicule',
  [BeneficiaryMobility.PermitPending]: 'Permis et/ou code en cours',
  [BeneficiaryMobility.InvalidPermit]: 'Permis non valide ou suspendu',
  [BeneficiaryMobility.VehicleWithoutPermit]: 'Véhicule sans permis',
  [BeneficiaryMobility.BikeOrEquivalent]: 'Vélo ou trottinette électrique',
  [BeneficiaryMobility.OtherPermit]: 'Autres permis (poids lourds, bus)'
}

export const BeneficiaryMobilityKeys = buildKeys(beneficiaryMobilityLabels)

export const beneficiaryMobilityOptions = labelsToOptions(
  beneficiaryMobilityLabels
)

export const beneficiaryGirLabels: {
  [key in BeneficiaryGir]: string
} = {
  [BeneficiaryGir.Level1]: 'Niveau 1',
  [BeneficiaryGir.Level2]: 'Niveau 2',
  [BeneficiaryGir.Level3]: 'Niveau 3',
  [BeneficiaryGir.Level4]: 'Niveau 4',
  [BeneficiaryGir.Level5]: 'Niveau 5',
  [BeneficiaryGir.Level6]: 'Niveau 6'
}

export const BeneficiaryGirKeys = buildKeys(beneficiaryGirLabels)

export const beneficiaryGirOptions = labelsToOptions(beneficiaryGirLabels)

export const beneficiarySocioProfessionalCategoryLabels: {
  [key in BeneficiarySocioProfessionalCategory]: string
} = {
  [BeneficiarySocioProfessionalCategory.SickLeave]: 'Arrêt maladie',
  [BeneficiarySocioProfessionalCategory.JobSeeker]: "En recherche d'emploi",
  [BeneficiarySocioProfessionalCategory.Disability]: 'Invalidité',
  [BeneficiarySocioProfessionalCategory.Housewife]: 'Mère au foyer',
  [BeneficiarySocioProfessionalCategory.Retired]: 'Retraité',
  [BeneficiarySocioProfessionalCategory.Employed]: 'Salarié',
  [BeneficiarySocioProfessionalCategory.NoActivity]:
    'Sans activité (non inscrit à Pôle Emploi)',
  [BeneficiarySocioProfessionalCategory.Other]: 'Autre'
}

export const BeneficiarySocioProfessionalCategoryKeys = buildKeys(
  beneficiarySocioProfessionalCategoryLabels
)

export const beneficiarySocioProfessionalCategoryOptions = labelsToOptions(
  beneficiarySocioProfessionalCategoryLabels
)

export const incomeSourceLabels: {
  [key in IncomeSource]: string
} = {
  [IncomeSource.Aah]: 'AAH',
  [IncomeSource.Apl]: 'APL',
  [IncomeSource.Aspa]: 'ASPA',
  [IncomeSource.IndemnitesJournalieres]: 'Indemnités journalières',
  [IncomeSource.IndemnitesPoleEmploi]: 'Indemnités Pôle Emploi : ARE/ASS',
  [IncomeSource.PensionInvalidite]: "Pension d'invalidité",
  [IncomeSource.PrestationsFamiliales]: 'Prestations familiales',
  [IncomeSource.PrimeActivite]: "Prime d'activité",
  [IncomeSource.Retraite]: 'Retraite',
  [IncomeSource.Rsa]: 'RSA',
  [IncomeSource.Salaire]: 'Salaire',
  [IncomeSource.Autre]: 'Autre',
  [IncomeSource.PensionAlimentaire]: 'Pension alimentaire'
}

export const incomeSourceOptions = labelsToOptions(incomeSourceLabels)

export const beneficiaryProtectionMeasureLabels: {
  [key in BeneficiaryProtectionMeasure]: string
} = {
  [BeneficiaryProtectionMeasure.CuratelleSimple]: 'Curatelle simple',
  [BeneficiaryProtectionMeasure.CuratelleRenforcee]: 'Curatelle renforcée',
  [BeneficiaryProtectionMeasure.HabilitationDuConjoint]:
    'Habilitation du conjoint',
  [BeneficiaryProtectionMeasure.HabilitationFamiliale]:
    'Habilitation familiale',
  [BeneficiaryProtectionMeasure.MandatDeProtectionFuture]:
    'Mandat de protection future',
  [BeneficiaryProtectionMeasure.MesureAccompagnement]:
    "Mesure d'accompagnement (Masp/Maj/MJAGBF)",
  [BeneficiaryProtectionMeasure.SauvegardeDeJustice]: 'Sauvegarde de justice',
  [BeneficiaryProtectionMeasure.Tutelle]: 'Tutelle'
}

export const BeneficiaryProtectionMeasureKeys = buildKeys(
  beneficiaryProtectionMeasureLabels
)

export const beneficiaryProtectionMeasureOptions = labelsToOptions(
  beneficiaryProtectionMeasureLabels
)

export const beneficiaryOrientationTypeLabels: {
  [key in BeneficiaryOrientationType]: string
} = {
  [BeneficiaryOrientationType.Association]: 'Orientation Association',
  [BeneficiaryOrientationType.Departement]: 'Orientation Département',
  [BeneficiaryOrientationType.Elu]: 'Orientation Élu',
  [BeneficiaryOrientationType.Tiers]: "Signalement d'un tiers",
  [BeneficiaryOrientationType.Spontanee]: 'Spontanée',
  [BeneficiaryOrientationType.SuiviCabinet]: 'Suivi cabinet',
  [BeneficiaryOrientationType.Autre]: 'Autre'
}

export const BeneficiaryOrientationTypeKeys = buildKeys(
  beneficiaryOrientationTypeLabels
)

export const beneficiaryOrientationTypeOptions = labelsToOptions(
  beneficiaryOrientationTypeLabels
)

const commonRelationshipLabels = {
  [RelativeRelationship.Conjoint]: 'Conjoint·e',
  [RelativeRelationship.EnfantMajeur]: 'Enfant majeur',
  [RelativeRelationship.EnfantMineur]: 'Enfant mineur',
  [RelativeRelationship.Sibling]: 'Fratrie',
  [RelativeRelationship.Grandparent]: 'Grand-parent',
  [RelativeRelationship.Parent]: 'Parent',
  [RelativeRelationship.Tiers]: 'Tiers',
  [RelativeRelationship.AutreMemberDeLaFamille]: 'Autre membre de la famille'
}

const entourageRelationshipLabels = {
  [RelativeRelationship.Neighbour]: 'Voisin·e',
  [RelativeRelationship.EntourageProfessionnel]: 'Entourage professionnel',
  [RelativeRelationship.Ami]: 'Ami·e'
}

export const relativeRelationshipLabels = {
  ...commonRelationshipLabels,
  ...entourageRelationshipLabels
}

export const RelativeRelationshipKeys = buildKeys(relativeRelationshipLabels)

export const taxHouseHoldRelationshipOptions = labelsToOptions(
  commonRelationshipLabels
)

export const entourageRelationshipOptions = labelsToOptions({
  ...commonRelationshipLabels,
  ...entourageRelationshipLabels
})

export const beneficiaryAccommodationZoneLabels: {
  [key in BeneficiaryAccommodationZone]: string
} = {
  France: 'France',
  Europe: 'Europe',
  OutsideEurope: 'Hors Europe'
}

export const BeneficiaryAccommodationZoneKeys = buildKeys(
  beneficiaryAccommodationZoneLabels
)

export const beneficiaryAccommodationZoneOptions = labelsToOptions(
  beneficiaryAccommodationZoneLabels
)

export const beneficiaryAccommodationModeLabels: {
  [key in BeneficiaryAccommodationMode]: string
} = {
  [BeneficiaryAccommodationMode.NursingHome]: 'EHPAD, résidence senior',
  [BeneficiaryAccommodationMode.EmergencyHousing]:
    'Hébergement de type CHRS, CHU, CPH, CADA...',
  [BeneficiaryAccommodationMode.Parents]: 'Hébergé·e au domicile parental',
  [BeneficiaryAccommodationMode.ThirdPerson]: 'Hébergé·e chez un tiers',
  [BeneficiaryAccommodationMode.PrivateRenting]: 'Locataire parc privé',
  [BeneficiaryAccommodationMode.SocialRenting]: 'Locataire parc social',
  [BeneficiaryAccommodationMode.Fortune]: 'Logement de fortune',
  [BeneficiaryAccommodationMode.Substandard]: 'Logement insalubre',
  [BeneficiaryAccommodationMode.Owner]: 'Propriétaire',
  [BeneficiaryAccommodationMode.None]: 'Sans hébergement',
  [BeneficiaryAccommodationMode.Other]: 'Autre type de logement (hôtel...)'
}

export const BeneficiaryAccommodationModeKeys = buildKeys(
  beneficiaryAccommodationModeLabels
)

export const beneficiaryAccommodationModeOptions = labelsToOptions(
  beneficiaryAccommodationModeLabels
)

export const OrganisationAccommodationModes: BeneficiaryAccommodationMode[] = [
  BeneficiaryAccommodationMode.EmergencyHousing,
  BeneficiaryAccommodationMode.NursingHome,
  BeneficiaryAccommodationMode.Other
]

export const ThirdPartyAccommodationModes: BeneficiaryAccommodationMode[] = [
  BeneficiaryAccommodationMode.ThirdPerson,
  BeneficiaryAccommodationMode.Parents
]

export const HostedAccommodationMode: BeneficiaryAccommodationMode[] = [
  ...OrganisationAccommodationModes,
  ...ThirdPartyAccommodationModes
]
