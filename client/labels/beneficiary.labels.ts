import type { Beneficiary } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type BeneficiaryFieldLabels = Omit<
  Beneficiary & {
    referents: string
    documents: string
    entourages: string
    taxHouseholds: string
    historyTotal: string
    types: string
  },
  'createdById' | 'archivedById' | 'archived' | 'created'
>

const beneficiaryFieldLabels: FieldLabels<BeneficiaryFieldLabels> = {
  id: 'Identifiant',
  fileNumber: 'N° dossier',
  structureId: 'Structure',
  referents: 'Agent(s) référent(s)',
  aidantConnectAuthorized: 'Mandat Aidant Connect',
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
  street: 'Adresse',
  addressComplement: "Complément d'adresse",
  noPhone: "N'a pas de téléphone",
  phone1: 'Numéro de téléphone',
  phone2: 'Numéro de téléphone',
  email: 'Email',
  familySituation: 'Situation familiale',
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
  employer: 'Employeur',
  employerSiret: "SIRET de l'employeur",
  mainIncomeSource: 'Natures des ressources',
  mainIncomeAmount: 'Montant des ressources',
  unemploymentNumber: 'N° Pôle Emploi',
  pensionOrganisations: 'Organismes de retraite',
  cafNumber: 'N° CAF',
  bank: 'Banque',
  funeralContract: 'Contrat obsèques',
  protectionMeasure: 'Mesures de protection',
  representative: 'Nom, prénom, coordonées du mandataire',
  prescribingStructure: 'Organisme prescripteur',
  orientationType: "Mode d'orientation",
  orientationStructure: "Organisme d'orientation",
  serviceProviders: 'Prestataires',
  involvedPartners: 'Partenaires intervenants',
  partnerMainIncomeSource: 'Nature des ressources du conjoint',
  partnerMainIncomeAmount: 'Montant des ressources du conjoint',
  majorChildrenMainIncomeSource: 'Nature des ressources des enfants majeurs',
  majorChildrenMainIncomeAmount: 'Montant des ressources des enfants majeurs',
  deathDate: 'Date de décès',
  ministereCategorie: 'Catégorie',
  ministereDepartementServiceAc:
    "Département ou service de l'Administration Centrale",
  ministereStructure: 'Structure de rattachement',
  otherPensionOrganisations: 'Autre(s) organisme(s) de retraite',
  accommodationZone: "Zone d'hébergement",
  documents: 'Documents',
  updated: 'Dernière mise à jour',
  entourages: 'Entourage',
  taxHouseholds: 'Foyer fiscal',
  historyTotal: 'Nombre de suivis',
  types: "Types d'accompagnement"
}

export { beneficiaryFieldLabels }
