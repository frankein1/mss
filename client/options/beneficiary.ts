import {
  BeneficiaryAccommodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryTitle,
  BeneficiaryStudyLevel,
  Gender,
  RelativeRelationship
} from '@prisma/client'
import { buildKeys, mergeKeys } from '~/utils/keys/keyBuilder'

export const pensionOrganisationKeys = buildKeys({
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
})

export const beneficiaryStatusKeys = buildKeys({
  [BeneficiaryStatus.Active]: 'Actif',
  [BeneficiaryStatus.Inactive]: 'Inactif',
  [BeneficiaryStatus.Archived]: 'Archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e'
})

export const beneficiaryStatusDetailedKeys = buildKeys({
  [BeneficiaryStatus.Active]: 'Dossier actif',
  [BeneficiaryStatus.Inactive]: 'Dossier inactif',
  [BeneficiaryStatus.Archived]: 'Dossier archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e'
})

export const beneficiaryTitleKeys = buildKeys({
  [BeneficiaryTitle.Miss]: 'Mme.',
  [BeneficiaryTitle.Mister]: 'M.'
})

export const beneficiaryGenderKeys = buildKeys({
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre'
})

export const beneficiaryFamilySituationKeys = buildKeys({
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
})

export const beneficiaryMobilityKeys = buildKeys({
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
})

export const beneficiaryGirKeys = buildKeys({
  [BeneficiaryGir.Level1]: 'Niveau 1',
  [BeneficiaryGir.Level2]: 'Niveau 2',
  [BeneficiaryGir.Level3]: 'Niveau 3',
  [BeneficiaryGir.Level4]: 'Niveau 4',
  [BeneficiaryGir.Level5]: 'Niveau 5',
  [BeneficiaryGir.Level6]: 'Niveau 6'
})

export const beneficiarySocioProfessionalCategoryKeys = buildKeys({
  [BeneficiarySocioProfessionalCategory.SickLeave]: 'Arrêt maladie',
  [BeneficiarySocioProfessionalCategory.Entrepreneur]: "Chef.fe d'entreprise",
  [BeneficiarySocioProfessionalCategory.JobSeeker]: "En recherche d'emploi",
  [BeneficiarySocioProfessionalCategory.Freelance]: 'Indépendant.e',
  [BeneficiarySocioProfessionalCategory.Disability]: 'Invalidité',
  [BeneficiarySocioProfessionalCategory.Housewife]: 'Mère au foyer',
  [BeneficiarySocioProfessionalCategory.Retired]: 'Retraité',
  [BeneficiarySocioProfessionalCategory.Employed]: 'Salarié',
  [BeneficiarySocioProfessionalCategory.NoActivity]:
    'Sans activité (non inscrit à Pôle Emploi)',
  [BeneficiarySocioProfessionalCategory.Other]: 'Autre'
})

export const beneficiaryStudyLevelKeys = buildKeys({
  [BeneficiaryStudyLevel.Brevet]: 'Brevet',
  [BeneficiaryStudyLevel.CAP]: 'CAP',
  [BeneficiaryStudyLevel.Bac]: 'Bac',
  [BeneficiaryStudyLevel.BacPlus2]: 'Bac + 2',
  [BeneficiaryStudyLevel.Licence]: 'Licence',
  [BeneficiaryStudyLevel.Master]: 'Master',
  [BeneficiaryStudyLevel.Doctorat]: 'Doctorat'
})

export const incomeSourceKeys = buildKeys({
  Aah: 'AAH',
  Apl: 'APL',
  Aspa: 'ASPA',
  IndemnitesJournalieres: 'Indemnités journalières',
  IndemnitesPoleEmploi: 'Indemnités Pôle Emploi : ARE/ASS',
  PensionInvalidite: "Pension d'invalidité",
  PrestationsFamiliales: 'Prestations familiales',
  PrimeActivite: "Prime d'activité",
  Retraite: 'Retraite',
  Rsa: 'RSA',
  Salaire: 'Salaire',
  Autre: 'Autre',
  PensionAlimentaire: 'Pension alimentaire'
})

export const beneficiaryProtectionMeasureKeys = buildKeys({
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
})

export const familySituationKeys = buildKeys({
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
})

export const beneficiaryOrientationTypeKeys = buildKeys({
  [BeneficiaryOrientationType.Association]: 'Orientation Association',
  [BeneficiaryOrientationType.Departement]: 'Orientation Département',
  [BeneficiaryOrientationType.Elu]: 'Orientation Élu',
  [BeneficiaryOrientationType.Tiers]: "Signalement d'un tiers",
  [BeneficiaryOrientationType.Spontanee]: 'Spontanée',
  [BeneficiaryOrientationType.SuiviCabinet]: 'Suivi cabinet',
  [BeneficiaryOrientationType.Autre]: 'Autre'
})

export const commonRelationshipKeys = buildKeys({
  [RelativeRelationship.Conjoint]: 'Conjoint·e',
  [RelativeRelationship.EnfantMajeur]: 'Enfant majeur',
  [RelativeRelationship.EnfantMineur]: 'Enfant mineur',
  [RelativeRelationship.Sibling]: 'Fratrie',
  [RelativeRelationship.Grandparent]: 'Grand-parent',
  [RelativeRelationship.Parent]: 'Parent',
  [RelativeRelationship.Tiers]: 'Tiers',
  [RelativeRelationship.AutreMemberDeLaFamille]: 'Autre membre de la famille'
})

const entourageRelationshipKeys = buildKeys({
  [RelativeRelationship.Neighbour]: 'Voisin·e',
  [RelativeRelationship.EntourageProfessionnel]: 'Entourage professionnel',
  [RelativeRelationship.Ami]: 'Ami·e'
})

export const relativeRelationshipKeys = mergeKeys(
  commonRelationshipKeys,
  entourageRelationshipKeys
)

export const taxHouseHoldRelationshipKeys = commonRelationshipKeys

export const beneficiaryAccommodationZoneKeys = buildKeys({
  France: 'France',
  Europe: 'Europe',
  OutsideEurope: 'Hors Europe'
})

export const beneficiaryAccommodationModeKeys = buildKeys({
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
})

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
