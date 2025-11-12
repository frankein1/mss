import type { Prisma } from '@prisma/client'
import type { SnakeCase } from './utils'
/**
// PRIO 1 OK
Prisma.UserScalarFieldEnum
Prisma.StructureScalarFieldEnum
Prisma.SocialSupportSubjectScalarFieldEnum
Prisma.FamilyFileScalarFieldEnum
Prisma.BeneficiaryScalarFieldEnum
Prisma.DocumentScalarFieldEnum
 public | _family_file_referents           | table | mss

// PRIO 2 OK
Prisma.SocialSupportScalarFieldEnum
 public | _document_to_social_support      | table | mss
 public | _social_support_to_followup_type | table | mss
Prisma.PartnerOrganizationContactScalarFieldEnum
Prisma.PartnerOrganizationScalarFieldEnum
Prisma.FollowupScalarFieldEnum
Prisma.FileInstructionScalarFieldEnum
Prisma.HelpRequestScalarFieldEnum
Prisma.HousingHelpRequestScalarFieldEnum

// PRIO 3
Prisma.AccountScalarFieldEnum
Prisma.BeneficiaryRelativeScalarFieldEnum
Prisma.ArchivedBeneficiaryScalarFieldEnum
Prisma.CommentScalarFieldEnum
Prisma.NotificationScalarFieldEnum
Prisma.CGUHistoryScalarFieldEnum
Prisma.WorkshopScalarFieldEnum
Prisma.WorkshopNameScalarFieldEnum
Prisma.WorkshopAttendeeScalarFieldEnum
Prisma.WorkshopExternalAttendeeScalarFieldEnum

// NO
Prisma.UserActivityScalarFieldEnum
Prisma.DataInclusionStructureScalarFieldEnum
Prisma.EmailScalarFieldEnum
Prisma.ApiTokenScalarFieldEnum
 */

const configUser: Record<
  SnakeCase<keyof typeof Prisma.UserScalarFieldEnum>,
  boolean
> = {
  id: true,
  created: true,
  updated: true,
  role: true,
  first_access: true,
  last_access: true,
  status: true,
  structure_id: true,
  external_rdvsp_id: true,
  aidant_connect_authorisation: true,
  // -- BEGIN ANONYMIZED
  first_name: false,
  last_name: false,
  email: false,
  account_reminder_email: true,
  authorization_code: false,
  authorization_code_validity: false
}

const configStructure: Record<
  SnakeCase<keyof typeof Prisma.StructureScalarFieldEnum>,
  boolean
> = {
  id: true,
  created: true,
  updated: true,
  type: true,
  disabled: true,
  name: true,
  siret: true,
  city: true,
  address: true,
  zipcode: true,
  insee_code: true,
  inhabitants_number: true,
  last_access: true,
  last_activity: true,
  external_rdvsp_active: true,
  external_rdvsp_id: true,
  deactivation_alert_email: true,
  deactivation_alert_email_date: true,
  // -- BEGIN ANONYMIZED
  email: false,
  phone: false,
  dpo_email: false,
  dpo_first_name: false,
  dpo_last_name: false
}

// Adaptation needed because of typo in column name
type SocialSupportSubjectColumnName =
  | Exclude<
      SnakeCase<keyof typeof Prisma.SocialSupportSubjectScalarFieldEnum>,
      'owned_by_structure_id'
    >
  | 'owned_by_structured_id'

const configSubject: Record<SocialSupportSubjectColumnName, boolean> = {
  id: true,
  created: true,
  name: true,
  default: true,
  used: true,
  inactive: true,
  created_by_id: true,
  owned_by_structured_id: true
}

const configFamilyFile: Record<
  SnakeCase<keyof typeof Prisma.FamilyFileScalarFieldEnum>,
  boolean
> = {
  id: true,
  structure_id: true
}

type BeneficiaryColumnName =
  | Exclude<
      SnakeCase<keyof typeof Prisma.BeneficiaryScalarFieldEnum>,
      'is_school_in_q_p_v'
    >
  | 'is_school_in_qpv'

const configBeneficiary: Record<BeneficiaryColumnName, boolean> = {
  id: true,
  created: true,
  updated: true,
  structure_id: true,
  family_file_id: true,
  created_by_id: true,
  split_from_file_by_id: true,
  previous_family_file_id: true,
  disabled_by_id: true,
  external_rdvsp_id: true,
  title: true,
  gender: true,
  nationality: true,
  birth_date: true,
  death_date: true,
  city: true,
  zipcode: true,
  department: true,
  region: true,
  qpv: true,
  status: true,
  insurance: true,
  occupation: true,
  pension_organisations: true,
  orientation_type: true,
  other_pension_organisations: true,
  bank: true,
  funeral_contract: true,
  protection_measure: true,
  prescribing_structure: true,
  involved_partners: true,
  accommodation_additional_information: true,
  accommodation_mode: true,
  accommodation_name: true,
  accommodation_zone: true,
  aidant_connect_authorized: true,
  archive_due_date: true,
  archive_due_date_history: true,
  service_providers: true,
  socio_professional_category: true,
  study_level: true,
  is_school_in_qpv: true,
  family_situation: true,
  ministere_structure: true,
  ministere_departement_service_ac: true,
  orientation_structure: true,
  wedding_date: true,
  divorce_date: true,
  caregiver: true,
  major_children: true,
  minor_children: true,
  ministere_categorie: true,
  mobility: true,
  vulnerable_person: true,
  relationship: true,
  // -- BEGIN ANONYMIZED
  first_name: false,
  usual_name: false,
  birth_name: false,
  usual_name_normalized: false,
  first_name_normalized: false,
  birth_name_normalized: false,
  social_security_number: false,
  birth_place: false,
  email: false,
  street: false,
  file_number: false,
  address_complement: false,
  phone1: false,
  phone2: false,
  no_phone: false,
  gir: false,
  doctor: false,
  additional_information: false,
  unemployment_number: false,
  caf_number: false,
  health_additional_information: false,
  numero_pegase: false,
  representative: false,
  employer: false,
  employer_siret: false,
  school_name: false
}

const configDocument: Record<
  SnakeCase<keyof typeof Prisma.DocumentScalarFieldEnum>,
  boolean
> = {
  key: true,
  mime_type: true,
  size: true,
  type: true,
  migrated: true,
  created: true,
  created_by_id: true,
  family_file_id: true,
  beneficiary_id: true,
  tags: true,
  confidential: true,
  // -- BEGIN ANONYMIZED
  name: false,
  filename_disk: false,
  filename_download: false
}

const configFamilyFileToReferent = {
  A: true,
  B: true
} as Record<'A' | 'B', boolean>

const configSocialSupport: Record<
  SnakeCase<keyof typeof Prisma.SocialSupportScalarFieldEnum>,
  boolean
> = {
  id: true,
  created: true,
  updated: true,
  structure_id: true,
  family_file_id: true,
  beneficiary_id: true,
  created_by_id: true,
  last_updated_by_id: true,
  date: true,
  social_support_type: true,
  ministre: true,
  status: true,
  due_date: true,
  // -- BEGIN ANONYMIZED
  synthesis: false,
  synthesis_rich_text: false,
  private_synthesis: false,
  private_synthesis_rich_text: false,
  numero_pegase: false
}

const configDocumentToSocialSupport = {
  A: true,
  B: true
} as Record<'A' | 'B', boolean>

const configSocialSupportToFollowupType = {
  A: true,
  B: true
} as Record<'A' | 'B', boolean>

const configPartnerOrganization: Record<
  SnakeCase<keyof typeof Prisma.PartnerOrganizationScalarFieldEnum>,
  boolean
> = {
  id: true,
  created: true,
  name: true,
  created_by_id: true,
  structure_id: true,
  data_inclusion_id: true,
  inactive: true,
  // -- BEGIN ANONYMIZED
  siret: false,
  address: false,
  city: false,
  zipcode: false,
  phone1: false,
  phone2: false,
  email: false,
  working_hours: false
}

const configPartnerOrganizationContact: Record<
  SnakeCase<keyof typeof Prisma.PartnerOrganizationContactScalarFieldEnum>,
  boolean
> = {
  id: true,
  name: true,
  phone: true,
  email: true,
  partner_id: true
}

const configFollowup: Record<
  SnakeCase<keyof typeof Prisma.FollowupScalarFieldEnum>,
  boolean
> = {
  id: true,
  updated: true,
  prescribing_organization_id: true,
  prescribing_organization_contact_id: true,
  medium: true,
  help_requested: true,
  place: true,
  structure_name: true,
  classified: true,
  first_followup: true,
  forwarded_to_justice: true,
  redirected: true,
  duration: true,
  social_support_id: true,
  // -- BEGIN ANONYMIZED
  third_person_name: false
}

const configFileInstruction: Record<
  SnakeCase<keyof typeof Prisma.FileInstructionScalarFieldEnum>,
  boolean
> = {
  id: true,
  updated: true,
  type: true,
  instructor_organization_id: true,
  instructor_organization_contact_id: true,
  external_structure: true,
  examination_date: true,
  decision_date: true,
  refusal_reason: true,
  refusal_reason_other: true,
  dispatch_date: true,
  full_file: true,
  social_support_id: true
}

// Adaptation needed historic name in DB has not been updated
type HelpRequestColumnName =
  | Exclude<
      SnakeCase<keyof typeof Prisma.HelpRequestScalarFieldEnum>,
      'subject_id'
    >
  | 'type_id'

const configHelpRequest: Record<HelpRequestColumnName, boolean> = {
  id: true,
  type_id: true,
  prescribing_organization_id: true,
  prescribing_organization_contact_id: true,
  file_instruction_id: true,
  financial_support: true,
  is_refundable: true,
  asked_amount: true,
  allocated_amount: true,
  payment_date: true,
  payment_method: true,
  handling_date: true
}

const configHousingHelpRequest: Record<
  SnakeCase<keyof typeof Prisma.HousingHelpRequestScalarFieldEnum>,
  boolean
> = {
  id: true,
  prescribing_organization_id: true,
  prescribing_organization_contact_id: true,
  is_first: true,
  first_opening_date: true,
  asked_housing: true,
  unique_id: true,
  tax_household_additional_information: true,
  max_charges: true,
  max_rent: true,
  housing_type: true,
  room_count: true,
  is_pmr: true,
  reason: true,
  low_income_housing_type: true,
  file_instruction_id: true
}

export const CONFIG = {
  user: configUser,
  structure: configStructure,
  family_file: configFamilyFile,
  followup_type: configSubject,
  beneficiary: configBeneficiary,
  document: configDocument,
  _family_file_referents: configFamilyFileToReferent,
  social_support: configSocialSupport,
  _document_to_social_support: configDocumentToSocialSupport,
  _social_support_to_followup_type: configSocialSupportToFollowupType,
  partner_organization: configPartnerOrganization,
  partner_organization_contact: configPartnerOrganizationContact,
  followup: configFollowup,
  file_instruction: configFileInstruction,
  help_request: configHelpRequest,
  housing_help_request: configHousingHelpRequest
}

export type TableName = keyof typeof CONFIG

export const TABLE_NAMES = Object.keys(CONFIG) as TableName[]
