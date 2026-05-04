import type { Beneficiary } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type BeneficiaryFieldLabels = Omit<
  Beneficiary & {
    referents: string
    documents: string
    entourages: string
    taxHouseholds: string
    historyTotal: string
    subjects: string
    relationship: string
  },
  | 'createdById'
  | 'disabledById'
  | 'previousFamilyFileId'
  | 'splitFromFileById'
  | 'externalRdvspId'
  | 'firstNameNormalized'
  | 'firstNameNormalized'
  | 'usualNameNormalized'
  | 'birthNameNormalized'
>

const beneficiaryFieldLabels: FieldLabels<BeneficiaryFieldLabels> = {
  id: 'Identifiant',
  fileNumber: 'N° dossier bénéficiaire',
  structureId: 'Structure',
  familyFileId: 'Dossier foyer',
  referents: 'Agent(s) référent(s)',
  aidantConnectAuthorized: 'Mandat Aidants Connect',
  status: 'Statut du dossier',
  title: 'Civilité',
  usualName: 'Nom usuel',
  birthName: 'Nom de naissance',
  firstName: 'Prénom(s)',
  birthDate: 'Date de naissance',
  birthPlace: 'Lieu de naissance',
  gender: 'Genre',
  nationality: 'Nationalité',
  numeroPegase: 'Numéro Pégase',
  accommodationMode: "Mode d'hébergement",
  accommodationName: 'Dénomination de la structure / Nom et prénom du tiers',
  accommodationAdditionalInformation: 'Précisions hébergement',
  city: 'Ville',
  zipcode: 'Code postal',
  region: 'Région',
  department: 'Département',
  street: 'Adresse',
  addressComplement: "Complément d'adresse",
  qpv: 'Quartier prioritaire de la politique de la ville',
  noPhone: "N'a pas de téléphone",
  phone1: 'Numéro de téléphone',
  phone2: 'Numéro de téléphone 2',
  email: 'Email',
  familySituation: 'Situation familiale',
  divorceDate: 'Date de séparation / divorce',
  weddingDate: 'Date de mariage / pacs',
  minorChildren: "Nombre d'enfant(s) mineur(s)",
  majorChildren: "Nombre d'enfant(s) majeur(s)",
  caregiver: 'Aidant familial',
  mobility: 'Données mobilité',
  additionalInformation: 'Informations complémentaires',
  gir: 'GIR',
  doctor: 'Médecin traitant',
  healthAdditionalInformation: 'Informations complémentaires',
  socialSecurityNumber: 'N° de Sécurité Sociale',
  insurance: 'Mutuelle',
  socioProfessionalCategory: 'Catégorie socio-professionnelle',
  occupation: 'Profession(s)',
  studyLevel: "Niveau scolaire / d'étude",
  schoolName: "Nom de l'établissement",
  isSchoolInQPV: "L'établissement est en Quartier Prioritaire de la Ville",
  employer: 'Employeur',
  employerSiret: "SIRET de l'employeur",
  unemploymentNumber: 'N° France Travail',
  pensionOrganisations: 'Organismes de retraite',
  cafNumber: 'N° CAF',
  bank: 'Banque',
  funeralContract: 'Contrat obsèques',
  protectionMeasure: 'Mesures de protection',
  representative: 'Nom, prénom, coordonnées du mandataire',
  prescribingStructure: 'Organisme prescripteur',
  orientationType: "Mode d'orientation",
  orientationStructure: "Organisme d'orientation",
  serviceProviders: 'Prestataires',
  involvedPartners: 'Partenaires intervenants',
  deathDate: 'Date de décès',
  ministereCategorie: 'Catégorie',
  ministereDepartementServiceAc:
    "Département ou service de l'Administration Centrale",
  ministereStructure: 'Structure de rattachement',
  otherPensionOrganisations: 'Autre(s) organisme(s) de retraite',
  accommodationZone: "Zone d'hébergement",
  documents: 'Documents',
  updated: 'Dernière mise à jour',
  archiveDueDate: "Date d'archivage",
  archiveDueDateHistory: "Historique des dates d'archivage",
  lastActivity: 'Date de dernière activité',
  created: 'Date de création du dossier',
  entourages: 'Entourage',
  taxHouseholds: 'Foyer fiscal',
  historyTotal: 'Nombre de suivis',
  subjects: "Objets d'accompagnement",
  vulnerablePerson: 'Registre des personnes vulnérables',
  relationship: 'Lien de la relation'
}

export const beneficiaryExportFieldLabels = {
  beneficiaryFileNumber: beneficiaryFieldLabels.fileNumber,
  beneficiaryLastName: 'Nom bénéficiaire',
  beneficiaryFirstName: 'Prénom bénéficiaire'
}

export const beneficiaryDeviceExportFieldLabels = {
  deviceName: 'Nom dispositif',
  deviceStartDate: "Date d'entrée",
  deviceEndDate: 'Date de sortie',
  deviceExitReason: 'Motif de sortie',
  devicePartnerOrganisationName: 'Organisme partenaire',
  devicePrecisions: 'Précisions'
}

export { beneficiaryFieldLabels }
