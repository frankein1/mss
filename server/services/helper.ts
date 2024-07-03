import {
  Beneficiary,
  Comment,
  Document,
  FileInstruction,
  Followup,
  SocialSupportSubject,
  HelpRequest,
  HousingHelpRequest,
  SocialSupport,
  PartnerOrganization,
  User,
  PartnerOrganizationContact,
  FamilyFile
} from '@prisma/client'
import { BeneficiaryNames } from '~/types/beneficiary'

function show<T>(val: T, condition: boolean): T | null {
  return condition ? val : null
}

export function filterSocialSupport({
  socialSupport,
  conditions
}: {
  socialSupport: SocialSupport & {
    familyFile: FamilyFile & {
      referents: User[]
      beneficiaries: BeneficiaryNames[]
    }
    createdBy: User
    subjects: SocialSupportSubject[]
    documents?: Document[]
    comments?: (Comment & { createdBy: User })[]
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  return {
    id: socialSupport.id,
    socialSupportType: socialSupport.socialSupportType,
    date: socialSupport.date,
    structureId: socialSupport.structureId,
    created: socialSupport.created,
    createdBy: socialSupport.createdBy,
    createdById: socialSupport.createdById,
    updated: socialSupport.updated,
    status: socialSupport.status,
    subjects: socialSupport.subjects,

    familyFile: socialSupport.familyFile,
    familyFileId: socialSupport.familyFileId,

    dueDate: show(socialSupport.dueDate, conditions.details),

    privateSynthesis: show(
      socialSupport.privateSynthesis,
      conditions.privateSynthesis
    ),

    synthesis: show(socialSupport.synthesis, conditions.details),

    documents: show(socialSupport.documents, conditions.details),
    comments: show(socialSupport.comments, conditions.details),

    ministre: show(socialSupport.ministre, conditions.minister),
    numeroPegase: show(socialSupport.numeroPegase, conditions.minister)
  }
}

export function filterFollowup({
  followup,
  conditions
}: {
  followup: Followup & {
    prescribingOrganization: Partial<PartnerOrganization> | null
    prescribingOrganizationContact: Partial<PartnerOrganizationContact> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  return {
    // HEADER
    id: followup.id,
    structureName: followup.structureName,
    redirected: followup.redirected,
    medium: followup.medium,
    // MINISTERE
    classified: show(followup.classified, conditions.minister),
    forwardedToJustice: show(followup.forwardedToJustice, conditions.minister),
    // DETAILS
    prescribingOrganization: show(
      followup.prescribingOrganization,
      conditions.details
    ),
    prescribingOrganizationContact: show(
      followup.prescribingOrganizationContact,
      conditions.details
    ),
    firstFollowup: show(followup.firstFollowup, conditions.details),
    helpRequested: show(followup.helpRequested, conditions.details),
    thirdPersonName: show(followup.thirdPersonName, conditions.details),
    place: show(followup.place, conditions.details),
    duration: show(followup.duration, conditions.details)
  }
}
export function filterFileInstruction({
  fileInstruction,
  conditions
}: {
  fileInstruction: FileInstruction & {
    instructorOrganization: Partial<PartnerOrganization> | null
    instructorOrganizationContact: Partial<PartnerOrganizationContact> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions

  return {
    id: fileInstruction.id,
    type: fileInstruction.type,
    fullFile: fileInstruction.fullFile,
    decisionDate: show(fileInstruction.decisionDate, details),
    dispatchDate: show(fileInstruction.dispatchDate, details),

    examinationDate: show(fileInstruction.examinationDate, details),
    externalStructure: show(fileInstruction.externalStructure, details),
    instructorOrganizationId: show(
      fileInstruction.instructorOrganizationId,
      details
    ),
    instructorOrganizationContactId: show(
      fileInstruction.instructorOrganizationContactId,
      details
    ),

    refusalReason: show(fileInstruction.refusalReason, details),
    refusalReasonOther: show(fileInstruction.refusalReasonOther, details),

    instructorOrganization: show(
      fileInstruction.instructorOrganization,
      details
    ),
    instructorOrganizationContact: show(
      fileInstruction.instructorOrganizationContact,
      details
    )
  }
}

export function filterHousingHelpRequest({
  housingHelpRequest,
  conditions
}: {
  housingHelpRequest: HousingHelpRequest
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions
  return {
    id: housingHelpRequest.id,
    reason: show(housingHelpRequest.reason, details),
    isFirst: show(housingHelpRequest.isFirst, details),
    firstOpeningDate: show(housingHelpRequest.firstOpeningDate, details),
    askedHousing: show(housingHelpRequest.askedHousing, details),
    uniqueId: show(housingHelpRequest.uniqueId, details),
    taxHouseholdAdditionalInformation: show(
      housingHelpRequest.taxHouseholdAdditionalInformation,
      details
    ),
    maxRent: show(housingHelpRequest.maxRent, details),
    maxCharges: show(housingHelpRequest.maxCharges, details),
    housingType: show(housingHelpRequest.housingType, details),
    roomCount: show(housingHelpRequest.roomCount, details),
    isPmr: show(housingHelpRequest.isPmr, details),
    lowIncomeHousingType: show(housingHelpRequest.lowIncomeHousingType, details)
  }
}

export function filterHelpRequest({
  helpRequest,
  conditions
}: {
  helpRequest: HelpRequest & {
    prescribingOrganization: Partial<PartnerOrganization> | null
    prescribingOrganizationContact: Partial<PartnerOrganizationContact> | null
  }
  conditions: {
    details: boolean
    minister: boolean
    privateSynthesis: boolean
  }
}) {
  const { details } = conditions
  return {
    id: helpRequest?.id,
    financialSupport: helpRequest.financialSupport,

    allocatedAmount: show(helpRequest.allocatedAmount, details),
    askedAmount: show(helpRequest.askedAmount, details),
    isRefundable: show(helpRequest.isRefundable, details),

    handlingDate: show(helpRequest.handlingDate, details),

    paymentDate: show(helpRequest.paymentDate, details),
    paymentMethod: show(helpRequest.paymentMethod, details),
    prescribingOrganizationId: show(
      helpRequest.prescribingOrganizationId,
      details
    ),
    prescribingOrganizationContactId: show(
      helpRequest.prescribingOrganizationContactId,
      details
    ),

    prescribingOrganization: show(helpRequest.prescribingOrganization, details),
    prescribingOrganizationContact: show(
      helpRequest.prescribingOrganizationContact,
      details
    )
  }
}
