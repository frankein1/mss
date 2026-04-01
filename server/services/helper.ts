import type {
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
  FamilyFile,
  MinisterEntity,
  SocialSupportRedirection,
  Beneficiary
} from '@prisma/client'

import type { BeneficiaryIdentification } from '~/types/beneficiary'
import type { ProtectedAppContext } from '~/server/trpc'
import type { FamilyFileSecurityTarget } from '~/server/services'
import {
  getCommentPermissions,
  getDocumentPermissions
} from '~/server/security'

interface Conditions {
  details: boolean
  minister: boolean
  privateSynthesis: boolean
}

function show<T>(val: T, condition: boolean): T | null {
  return condition ? val : null
}

function userDto<T extends Pick<User, 'id' | 'firstName' | 'lastName'>>(u: T) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName
  }
}
function beneficiaryDto<
  T extends Pick<
    Beneficiary,
    'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate'
  >
>(u: T) {
  return {
    id: u.id,
    firstName: u.firstName,
    usualName: u.usualName,
    birthName: u.birthName,
    birthDate: u.birthDate
  }
}
function redirectionsDto<T extends SS['socialSupportRedirections']>(
  redirections: T
) {
  return redirections.map(r => ({
    id: r.id,
    type: r.type,
    motif: r.motif,
    partnerOrganizationId: r.partnerOrganizationId,
    partnerOrganizationContactId: r.partnerOrganizationContactId,
    partnerOrganization: {
      name: r.partnerOrganization?.name
    },
    partnerOrganizationContact: {
      name: r.partnerOrganizationContact?.name
    },
    externalStructureName: r.externalStructureName
  }))
}

// The partial is due to filterFileInstruction & filterHousingHelpRequest
// When those dto are refined, so should this one
function partnerOrganizationDto<T extends Partial<PartnerOrganization>>(p: T) {
  return {
    id: p.id,
    name: p.name
  }
}
function partnerOrganizationContactDto<
  T extends Partial<PartnerOrganizationContact>
>(p: T) {
  return {
    id: p.id,
    name: p.name
  }
}
function commentWithCreatorDto<
  T extends Comment & { createdBy: Pick<User, 'id' | 'firstName' | 'lastName'> }
>(c: T) {
  return {
    id: c.id,
    created: c.created,
    updated: c.updated,
    content: c.content,
    createdBy: userDto(c.createdBy)
  }
}
function documentDto<T extends Document>(d: T) {
  return {
    key: d.key,
    name: d.name,
    size: d.size,
    type: d.type,
    mimeType: d.mimeType,
    beneficiaryId: d.beneficiaryId,
    createdById: d.createdById,
    confidential: d.confidential
  }
}
// This is a temporary fix. The query must be reviewed with select and exact type
// matching
type SS = Omit<SocialSupport, 'ministre'> & {
  familyFile: FamilyFile & {
    referents?: User[]
  }
  minister?: MinisterEntity | null
  beneficiary: BeneficiaryIdentification
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName'>
  lastUpdatedBy: Pick<User, 'id' | 'firstName' | 'lastName'> | null
  subjects: SocialSupportSubject[]
  documents?: Pick<Document, 'key' | 'name'>[]
  comments?: (Comment & { createdBy: User })[]
  socialSupportRedirections: (Omit<
    SocialSupportRedirection,
    'createdAt' | 'socialSupportId'
  > & {
    partnerOrganization: { name: string } | null
    partnerOrganizationContact: { name: string } | null
  })[]
}

export function filterSocialSupport<T extends SS>({
  socialSupport,
  conditions
}: {
  socialSupport: T
  conditions: Conditions
}) {
  return {
    id: socialSupport.id,
    socialSupportType: socialSupport.socialSupportType,
    subtype: socialSupport.subtype,
    date: socialSupport.date,
    structureId: socialSupport.structureId,
    created: socialSupport.created,
    createdBy: socialSupport.createdBy && userDto(socialSupport.createdBy),
    lastUpdatedBy:
      socialSupport.lastUpdatedBy && userDto(socialSupport.lastUpdatedBy),
    createdById: socialSupport.createdById,
    updated: socialSupport.updated,
    status: socialSupport.status,
    subjects: socialSupport.subjects,

    familyFile: {
      id: socialSupport.familyFile.id,
      structureId: socialSupport.familyFile.structureId,
      referents: socialSupport.familyFile.referents?.map(r => userDto(r)) || []
    },
    familyFileId: socialSupport.familyFileId,

    beneficiary: beneficiaryDto(socialSupport.beneficiary),
    beneficiaryId: socialSupport.beneficiaryId,

    dueDate: show(socialSupport.dueDate, conditions.details),

    privateSynthesis: show(
      socialSupport.privateSynthesis,
      conditions.privateSynthesis
    ),
    privateSynthesisRichText: show(
      socialSupport.privateSynthesisRichText,
      conditions.privateSynthesis
    ),

    synthesis: show(socialSupport.synthesis, conditions.details),
    synthesisRichText: show(
      socialSupport.synthesisRichText,
      conditions.details
    ),

    ministerId: show(socialSupport.ministerId, conditions.minister),
    minister: show(socialSupport.minister, conditions.minister),
    socialSupportRedirections: show(
      redirectionsDto(socialSupport.socialSupportRedirections || []),
      conditions.details
    ),
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
      fileInstruction.instructorOrganization &&
        partnerOrganizationDto(fileInstruction.instructorOrganization),
      details
    ),
    instructorOrganizationContact: show(
      fileInstruction.instructorOrganizationContact &&
        partnerOrganizationContactDto(
          fileInstruction.instructorOrganizationContact
        ),
      details
    )
  }
}

export function filterHousingHelpRequest({
  housingHelpRequest,
  conditions
}: {
  housingHelpRequest: HousingHelpRequest & {
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
    handlingDate: show(housingHelpRequest.handlingDate, details),
    housingType: show(housingHelpRequest.housingType, details),
    roomCount: show(housingHelpRequest.roomCount, details),
    isPmr: show(housingHelpRequest.isPmr, details),
    lowIncomeHousingType: show(
      housingHelpRequest.lowIncomeHousingType,
      details
    ),
    prescribingOrganizationId: show(
      housingHelpRequest.prescribingOrganizationId,
      details
    ),
    prescribingOrganizationContactId: show(
      housingHelpRequest.prescribingOrganizationContactId,
      details
    ),

    prescribingOrganization: show(
      housingHelpRequest.prescribingOrganization &&
        partnerOrganizationDto(housingHelpRequest.prescribingOrganization),
      details
    ),
    prescribingOrganizationContact: show(
      housingHelpRequest.prescribingOrganizationContact &&
        partnerOrganizationContactDto(
          housingHelpRequest.prescribingOrganizationContact
        ),
      details
    )
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

    prescribingOrganization: show(
      helpRequest.prescribingOrganization &&
        partnerOrganizationDto(helpRequest.prescribingOrganization),
      details
    ),
    prescribingOrganizationContact: show(
      helpRequest.prescribingOrganizationContact &&
        partnerOrganizationContactDto(
          helpRequest.prescribingOrganizationContact
        ),
      details
    )
  }
}

export function filterDocuments({
  documents,
  conditions,
  ctx,
  familyFile
}: {
  documents: Document[]
  conditions: {
    details: boolean
  }
  ctx: ProtectedAppContext
  familyFile: FamilyFileSecurityTarget
}) {
  return (
    show(
      documents?.map(document => {
        return {
          document: documentDto(document),
          permissions: getDocumentPermissions({ ctx, familyFile, document })
        }
      }),
      conditions.details
    ) || []
  )
}

export function filterComments({
  comments,
  ctx
}: {
  comments: (Comment & {
    createdBy: Pick<User, 'id' | 'firstName' | 'lastName'>
  })[]
  ctx: ProtectedAppContext
}) {
  return (
    comments?.map(comment => {
      return {
        comment: commentWithCreatorDto(comment),
        permissions: getCommentPermissions({ ctx, comment })
      }
    }) || []
  )
}

/** Check that at least one entry in element is defined */
export function filterOutEmptyElements<T extends Record<string, unknown>>(
  element: T
) {
  return Object.entries(element).some(([key, value]) => key !== 'id' && !!value)
}
