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
  T extends Pick<Comment, 'id' | 'created' | 'updated' | 'content'> & {
    createdBy: Pick<User, 'id' | 'firstName' | 'lastName'>
  }
>(c: T) {
  return {
    id: c.id,
    created: c.created,
    updated: c.updated,
    content: c.content,
    createdBy: userDto(c.createdBy)
  }
}
type DocumentFields = Pick<
  Document,
  'key' | 'name' | 'createdById' | 'confidential'
>
function documentDto<T extends DocumentFields>(d: T) {
  return {
    key: d.key,
    name: d.name
  }
}
type SS = Pick<
  SocialSupport,
  | 'id'
  | 'socialSupportType'
  | 'subtype'
  | 'date'
  | 'updated'
  | 'status'
  | 'familyFileId'
  | 'beneficiaryId'
  | 'dueDate'
  | 'privateSynthesis'
  | 'privateSynthesisRichText'
  | 'synthesis'
  | 'synthesisRichText'
  | 'ministerId'
  | 'numeroPegase'
> & {
  familyFile: { id: string }
  minister?: Pick<
    MinisterEntity,
    'id' | 'firstName' | 'lastName' | 'function' | 'government'
  > | null
  beneficiary: BeneficiaryIdentification
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName'>
  lastUpdatedBy: Pick<User, 'id' | 'firstName' | 'lastName'> | null
  subjects: Pick<SocialSupportSubject, 'id' | 'name'>[]
  socialSupportRedirections: (Pick<
    SocialSupportRedirection,
    | 'id'
    | 'type'
    | 'motif'
    | 'externalStructureName'
    | 'partnerOrganizationId'
    | 'partnerOrganizationContactId'
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
    createdBy: socialSupport.createdBy && userDto(socialSupport.createdBy),
    lastUpdatedBy:
      socialSupport.lastUpdatedBy && userDto(socialSupport.lastUpdatedBy),
    updated: socialSupport.updated,
    status: socialSupport.status,
    subjects: socialSupport.subjects,
    familyFileId: socialSupport.familyFileId,
    beneficiary: beneficiaryDto(socialSupport.beneficiary),
    beneficiaryId: socialSupport.beneficiaryId,

    ...show(
      {
        dueDate: socialSupport.dueDate,
        synthesis: socialSupport.synthesis,
        synthesisRichText: socialSupport.synthesisRichText
      },
      conditions.details
    ),
    socialSupportRedirections: show(
      redirectionsDto(socialSupport.socialSupportRedirections || []),
      conditions.details
    ),

    ...show(
      {
        privateSynthesis: socialSupport.privateSynthesis,
        privateSynthesisRichText: socialSupport.privateSynthesisRichText
      },
      conditions.privateSynthesis
    ),

    ...show(
      {
        ministerId: socialSupport.ministerId,
        minister: socialSupport.minister,
        numeroPegase: socialSupport.numeroPegase
      },
      conditions.minister
    )
  }
}

export function filterFollowup({
  followup,
  conditions
}: {
  followup: Pick<
    Followup,
    | 'id'
    | 'medium'
    | 'classified'
    | 'forwardedToJustice'
    | 'firstFollowup'
    | 'helpRequested'
    | 'thirdPersonName'
    | 'place'
    | 'duration'
  > & {
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
    id: followup.id,
    medium: followup.medium,
    ...show(
      {
        classified: followup.classified,
        forwardedToJustice: followup.forwardedToJustice
      },
      conditions.minister
    ),
    ...show(
      {
        firstFollowup: followup.firstFollowup,
        helpRequested: followup.helpRequested,
        thirdPersonName: followup.thirdPersonName,
        place: followup.place,
        duration: followup.duration
      },
      conditions.details
    ),
    prescribingOrganization: show(
      followup.prescribingOrganization,
      conditions.details
    ),
    prescribingOrganizationContact: show(
      followup.prescribingOrganizationContact,
      conditions.details
    )
  }
}
export function filterFileInstruction({
  fileInstruction,
  conditions
}: {
  fileInstruction: Pick<
    FileInstruction,
    | 'id'
    | 'type'
    | 'fullFile'
    | 'decisionDate'
    | 'dispatchDate'
    | 'examinationDate'
    | 'externalStructure'
    | 'instructorOrganizationId'
    | 'instructorOrganizationContactId'
    | 'refusalReason'
    | 'refusalReasonOther'
  > & {
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
    ...show(
      {
        decisionDate: fileInstruction.decisionDate,
        dispatchDate: fileInstruction.dispatchDate,
        examinationDate: fileInstruction.examinationDate,
        externalStructure: fileInstruction.externalStructure,
        instructorOrganizationId: fileInstruction.instructorOrganizationId,
        instructorOrganizationContactId:
          fileInstruction.instructorOrganizationContactId,
        refusalReason: fileInstruction.refusalReason,
        refusalReasonOther: fileInstruction.refusalReasonOther
      },
      details
    ),
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
  housingHelpRequest: Pick<
    HousingHelpRequest,
    | 'id'
    | 'reason'
    | 'isFirst'
    | 'firstOpeningDate'
    | 'askedHousing'
    | 'uniqueId'
    | 'taxHouseholdAdditionalInformation'
    | 'maxRent'
    | 'maxCharges'
    | 'handlingDate'
    | 'housingType'
    | 'roomCount'
    | 'isPmr'
    | 'lowIncomeHousingType'
    | 'prescribingOrganizationId'
    | 'prescribingOrganizationContactId'
  > & {
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
    ...show(
      {
        reason: housingHelpRequest.reason,
        isFirst: housingHelpRequest.isFirst,
        firstOpeningDate: housingHelpRequest.firstOpeningDate,
        askedHousing: housingHelpRequest.askedHousing,
        uniqueId: housingHelpRequest.uniqueId,
        taxHouseholdAdditionalInformation:
          housingHelpRequest.taxHouseholdAdditionalInformation,
        maxRent: housingHelpRequest.maxRent,
        maxCharges: housingHelpRequest.maxCharges,
        handlingDate: housingHelpRequest.handlingDate,
        housingType: housingHelpRequest.housingType,
        roomCount: housingHelpRequest.roomCount,
        isPmr: housingHelpRequest.isPmr,
        lowIncomeHousingType: housingHelpRequest.lowIncomeHousingType,
        prescribingOrganizationId: housingHelpRequest.prescribingOrganizationId,
        prescribingOrganizationContactId:
          housingHelpRequest.prescribingOrganizationContactId
      },
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
  helpRequest: Pick<
    HelpRequest,
    | 'id'
    | 'financialSupport'
    | 'allocatedAmount'
    | 'askedAmount'
    | 'isRefundable'
    | 'handlingDate'
    | 'paymentDate'
    | 'paymentMethod'
    | 'prescribingOrganizationId'
    | 'prescribingOrganizationContactId'
  > & {
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
    ...show(
      {
        allocatedAmount: helpRequest.allocatedAmount,
        askedAmount: helpRequest.askedAmount,
        isRefundable: helpRequest.isRefundable,
        handlingDate: helpRequest.handlingDate,
        paymentDate: helpRequest.paymentDate,
        paymentMethod: helpRequest.paymentMethod,
        prescribingOrganizationId: helpRequest.prescribingOrganizationId,
        prescribingOrganizationContactId:
          helpRequest.prescribingOrganizationContactId
      },
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
  documents: DocumentFields[]
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
  comments: (Pick<
    Comment,
    'id' | 'created' | 'updated' | 'content' | 'createdById'
  > & {
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
