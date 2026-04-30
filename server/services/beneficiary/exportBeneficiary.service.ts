import fs from 'fs'
import path from 'path'
import hbs from 'handlebars'
import JSZip from 'jszip'
import type { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import {
  BeneficiaryRepo,
  UserRepo,
  SocialSupportRepo,
  DocumentRepo,
  WorkshopRepo
} from '~/server/database'
import type {
  Prisma,
  Beneficiary,
  BeneficiaryRelative,
  Followup,
  User,
  HelpRequest,
  FileInstruction,
  HousingHelpRequest
} from '@prisma/client'
import {
  documentTypeKeys,
  followupDurationKeys,
  followupMediumKeys,
  followupStatusKeys,
  archiveReasonKeys,
  beneficiaryAccommodationModeKeys,
  beneficiaryMobilityKeys,
  familySituationKeys,
  beneficiaryGirKeys,
  beneficiarySocioProfessionalCategoryKeys,
  beneficiaryProtectionMeasureKeys,
  beneficiaryOrientationTypeKeys,
  relativeRelationshipKeys,
  beneficiaryStatusKeys,
  beneficiaryTitleKeys,
  beneficiaryGenderKeys,
  beneficiaryStudyLevelKeys,
  pensionOrganisationKeys,
  fileInstructionStatusKeys,
  housingReasonKeys,
  housingTypeKeys,
  roomCountKeys,
  lowIncomeHousingKeys,
  helpRequestRefusalReasonKeys,
  fileInstructionTypeFilterKeys,
  nationalityKeys,
  workshopAttendeeAttendanceKeys,
  socialSupportRedirectionTypeKeys
} from '~/client/options'
import { getBudget } from '../budget/getBudget.service'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { exportBudgetWorkbook } from '../budget/exportBudgetSpreadsheet'
import { formatMinisterName } from '~/utils/minister'

type FieldLabels<T> = Record<keyof T, any>

export const exportBeneficiary = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiaryInput
}) => {
  const beneficiaryDetails = await getBeneficaryDetails(
    input.beneficiaryId,
    ctx.user
  )
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.user.id }
  })

  // social supports
  const socialSupports = await getSocialSupports(
    beneficiaryDetails.familyFileId,
    beneficiaryDetails.id,
    user
  )

  // counts
  const [
    housingCount,
    financialCount,
    otherCount,
    followupCount,
    workshopCount
  ] = await getCounts(
    beneficiaryDetails.familyFileId,
    beneficiaryDetails.id,
    user
  )

  // budget
  const budget = await getBudget({
    ctx,
    familyFileId: beneficiaryDetails.familyFileId
  })
  const budgetWorkbook = exportBudgetWorkbook(budget)
  const budgetBuffer = await createExportFromWorkbook(
    ctx.user.id,
    budgetWorkbook
  )

  // documents
  const documents = await DocumentRepo.findMany(user, {
    where: {
      familyFileId: beneficiaryDetails.familyFileId
    },
    select: {
      documentContent: true,
      name: true
    }
  })

  // workshops
  const workshops = await getWorkshops(beneficiaryDetails.id, user)

  // Abstract Page
  const abstractData = {
    name: getBeneficiaryName(beneficiaryDetails),
    birthDate: beneficiaryDetails.birthDate?.toLocaleDateString('fr-FR'),
    created: beneficiaryDetails.created?.toLocaleDateString('fr-FR'),
    archivedDate: new Date().toLocaleDateString('fr-FR'),
    userName: user.firstName + ' ' + user.lastName,
    reason: {
      completed: input.reason != null || input.clarification != null,
      reason: input.reason ? archiveReasonKeys.byKey[input.reason] : null,
      date: input.date?.toLocaleDateString('fr-FR'),
      clarification: input.clarification
    },
    counts: {
      totalHelpRequestCount: housingCount + financialCount + otherCount,
      housingCount,
      financialCount,
      otherCount,
      followupCount,
      workshopCount
    }
  }
  const abstractContent = await compile(
    'handlebars-templates/abstract-template.hbs',
    abstractData
  )

  // Beneficiary informations
  const informationsContent = await compile(
    'handlebars-templates/beneficiary-info-template.hbs',
    {
      beneficiaryName: getBeneficiaryName(beneficiaryDetails),
      ...getBeneficiaryInfoData(
        beneficiaryDetails as BeneficiaryWithEntourageAndRelative
      )
    }
  )

  // Followups
  const followups = await Promise.all(
    socialSupports
      .filter(socialSupport => socialSupport.socialSupportType === 'Followup')
      .map(async followup => {
        const content = await compile(
          'handlebars-templates/followup-template.hbs',
          {
            beneficiaryName: getBeneficiaryName(beneficiaryDetails),
            ...getFollowupData(followup)
          }
        )

        return {
          filename: `Historique/entretiens_${followup.id}.html`,
          content
        }
      })
  )

  // HelpRequests
  const helpRequests = await Promise.all(
    socialSupports
      .filter(
        socialSupport =>
          socialSupport.socialSupportType === 'HelpRequest' ||
          socialSupport.socialSupportType === 'HelpRequestHousing'
      )
      .map(async helpRequest => {
        const content = await compile(
          'handlebars-templates/help-request-template.hbs',
          {
            beneficiaryName: getBeneficiaryName(beneficiaryDetails),
            ...getHelpRequestData(helpRequest)
          }
        )

        return {
          filename: `Historique/instruction_de_dossier_${helpRequest.id}.html`,
          content
        }
      })
  )

  // Workshops
  const workshopContents = await Promise.all(
    workshops.map(async workshop => {
      const content = await compile(
        'handlebars-templates/workshop-template.hbs',
        {
          beneficiaryName: getBeneficiaryName(beneficiaryDetails),
          ...getWorkshopData(workshop)
        }
      )
      return {
        filename: `Atelier/atelier_${workshop.id}.html`,
        content
      }
    })
  )

  // create zip file
  const zip = new JSZip()
  zip.file('Résumé_archive.html', abstractContent)
  zip.file(
    `Informations/${getBeneficiaryName(beneficiaryDetails)}.html`,
    informationsContent
  )
  followups.forEach(followup => {
    zip.file(followup.filename, followup.content)
  })
  helpRequests.forEach(helpRequest => {
    zip.file(helpRequest.filename, helpRequest.content)
  })
  workshopContents.forEach(workshop => {
    zip.file(workshop.filename, workshop.content)
  })
  zip.file('Budget/budget_mensuel.xlsx', budgetBuffer, { binary: true })

  documents.forEach((document, idx) => {
    if (document.documentContent?.content) {
      const documentName = idx + 1 + ' - ' + document.name
      zip.file('Documents/' + documentName, document.documentContent.content, {
        binary: true
      })
    }
  })
  const generatedArchiveFile = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })
  const archiveFile = uint8ArrayToBase64(
    generatedArchiveFile,
    'application/zip'
  )

  return {
    archiveFile
  }
}

const uint8ArrayToBase64 = (
  uint8Array: Uint8Array,
  mimeType = 'application/pdf'
) => {
  // Convertir le Uint8Array en chaîne binaire
  const binaryString = Array.from(uint8Array)
    .map(byte => String.fromCharCode(byte))
    .join('')

  // Encoder la chaîne binaire en base64
  const base64String = btoa(binaryString)

  // Créer l'URL data: avec le type MIME et la chaîne base64
  return `data:${mimeType};base64,${base64String}`
}

const compile = async function (templateName: string, data: any) {
  const filePath = path.join(process.cwd(), 'public', templateName)
  const template = await fs.promises.readFile(filePath, 'utf-8')
  return hbs.compile(template)(data)
}

const getBeneficiaryName = (beneficiary: Beneficiary) => {
  return beneficiary.firstName + ' ' + beneficiary.usualName
}

type DocumentData = {
  name: string
  type: string | null
}

type SocialSupportForFollowupData = FieldLabels<
  Pick<
    Prisma.SocialSupportSelect,
    | 'createdBy'
    | 'lastUpdatedBy'
    | 'date'
    | 'minister'
    | 'numeroPegase'
    | 'status'
    | 'dueDate'
    | 'synthesis'
  >
>

type RedirectionData = {
  type: string | null
  motif: string | null
  partnerOrganizationName: string | null
  partnerOrganizationContactName: string | null
  externalStructureName: string | null
}

type FollowupData = FieldLabels<
  Omit<
    Followup,
    | 'id'
    | 'updated'
    | 'socialSupportId'
    | 'prescribingOrganizationId'
    | 'prescribingOrganizationContactId'
  >
> &
  SocialSupportForFollowupData & {
    prescribingOrganizationName: string | null
    prescribingOrganizationContact: string | null
    actions: boolean
    documents: DocumentData[] | null
    subjectsNames: string
    redirections: RedirectionData[] | null
  }

const getFollowupData = (socialSupport: SocialSupportItem): FollowupData => {
  const subjectsNames = socialSupport.subjects.map(subject => subject.name)
  const documents = socialSupport.documents?.map(document => ({
    name: document.name,
    type: documentTypeKeys.value(document.type) || null
  }))
  const redirections =
    socialSupport.socialSupportRedirections?.map(r => ({
      type: socialSupportRedirectionTypeKeys.value(r.type) || null,
      motif: r.motif || null,
      partnerOrganizationName: r.partnerOrganization?.name || null,
      partnerOrganizationContactName:
        r.partnerOrganizationContact?.name || null,
      externalStructureName: r.externalStructureName || null
    })) || null
  return {
    createdBy: getPrettyUserName(socialSupport.createdBy),
    lastUpdatedBy: getPrettyUserName(socialSupport.lastUpdatedBy),
    firstFollowup: socialSupport.followup?.firstFollowup || null,
    date: socialSupport.date.toLocaleDateString('fr-FR'),
    minister: socialSupport.minister
      ? formatMinisterName(socialSupport.minister)
      : null,
    numeroPegase: socialSupport.numeroPegase,
    duration: socialSupport.followup?.duration
      ? followupDurationKeys.value(socialSupport.followup.duration)
      : null,
    medium: socialSupport.followup?.medium
      ? followupMediumKeys.value(socialSupport.followup.medium)
      : null,
    thirdPersonName: socialSupport.followup?.thirdPersonName,
    place: socialSupport.followup?.place,
    subjectsNames: subjectsNames.join(', '),
    status: socialSupport.status
      ? followupStatusKeys.value(socialSupport.status)
      : null,
    dueDate: socialSupport.dueDate?.toLocaleDateString('fr-FR'),
    prescribingOrganizationName:
      socialSupport.followup?.prescribingOrganization?.name || null,
    prescribingOrganizationContact:
      socialSupport.followup?.prescribingOrganizationContact?.name || null,
    synthesis: socialSupport.synthesis,
    actions:
      Boolean(socialSupport.followup?.forwardedToJustice) ||
      Boolean(socialSupport.followup?.helpRequested) ||
      Boolean(socialSupport.followup?.classified),
    forwardedToJustice: socialSupport.followup?.forwardedToJustice,
    helpRequested: socialSupport.followup?.helpRequested,
    classified: socialSupport.followup?.classified,
    redirections,
    documents: documents || null
  }
}

type SocialSupportForFileInstructionData = FieldLabels<
  Pick<
    Prisma.SocialSupportSelect,
    | 'createdBy'
    | 'lastUpdatedBy'
    | 'date'
    | 'minister'
    | 'numeroPegase'
    | 'synthesis'
  >
>

type BaseFileInstruction = Omit<
  FileInstruction,
  | 'id'
  | 'updated'
  | 'type'
  | 'socialSupportId'
  | 'instructorOrganizationId'
  | 'instructorOrganizationContactId'
> & {
  status: string | null
  instructorOrganization: string | null
  instructorOrganizationContact: string | null
}

type HelpRequestData = FieldLabels<
  BaseFileInstruction &
    Omit<
      HelpRequest,
      | 'id'
      | 'updated'
      | 'socialSupportId'
      | 'prescribingOrganizationId'
      | 'prescribingOrganizationContactId'
      | 'subjectId'
      | 'fileInstructionId'
      | 'financialSupport'
    > & {
      type: string | null
      isFinancial: boolean
      isOther: boolean
      subject: string | null
      prescribingOrganization: string | null
      prescribingOrganizationContact: string | null
      dueDate: string | null
      handlingDate: Date | null
    }
>

type HousingHelpRequestData = FieldLabels<
  BaseFileInstruction &
    Omit<
      HousingHelpRequest,
      | 'id'
      | 'updated'
      | 'socialSupportId'
      | 'prescribingOrganizationId'
      | 'prescribingOrganizationContactId'
      | 'fileInstructionId'
    > & {
      prescribingOrganization: string | null
      prescribingOrganizationContact: string | null
    }
>

type FileInstructionData = SocialSupportForFileInstructionData & {
  helpRequest?: HelpRequestData
  housingHelpRequest?: HousingHelpRequestData
  documents: DocumentData[] | null
  redirections: RedirectionData[] | null
}

function toBooleanLabel(
  value: boolean | null | undefined,
  trueLabel: string,
  falseLabel: string
) {
  if (value == null) {
    return ''
  }

  return value ? trueLabel : falseLabel
}

const getHelpRequestData = (
  socialSupport: SocialSupportItem
): FileInstructionData => {
  const documents = socialSupport.documents?.map(document => ({
    name: document.name,
    type: documentTypeKeys.value(document.type) || null
  }))
  const redirections =
    socialSupport.socialSupportRedirections?.map(r => ({
      type: socialSupportRedirectionTypeKeys.value(r.type) || null,
      motif: r.motif || null,
      partnerOrganizationName: r.partnerOrganization?.name || null,
      partnerOrganizationContactName:
        r.partnerOrganizationContact?.name || null,
      externalStructureName: r.externalStructureName || null
    })) || null

  const commonObjects: FieldLabels<BaseFileInstruction> = {
    externalStructure: socialSupport.fileInstruction?.externalStructure
      ? 'En externe'
      : 'En interne',
    instructorOrganization:
      socialSupport.fileInstruction?.instructorOrganization?.name,
    instructorOrganizationContact:
      socialSupport.fileInstruction?.instructorOrganizationContact?.name,
    dispatchDate:
      socialSupport.fileInstruction?.dispatchDate?.toLocaleDateString('fr-FR'),
    status: fileInstructionStatusKeys.value(socialSupport.status),
    examinationDate:
      socialSupport.fileInstruction?.examinationDate?.toLocaleDateString(),
    decisionDate:
      socialSupport.fileInstruction?.decisionDate?.toLocaleDateString('fr-FR'),
    refusalReason: helpRequestRefusalReasonKeys.value(
      socialSupport.fileInstruction?.refusalReason
    ),
    refusalReasonOther: socialSupport.fileInstruction?.refusalReasonOther,
    fullFile: socialSupport.fileInstruction?.fullFile
  }

  return {
    createdBy: getPrettyUserName(socialSupport.createdBy),
    lastUpdatedBy: getPrettyUserName(socialSupport.lastUpdatedBy),
    date: socialSupport.date.toLocaleDateString('fr-FR'), // commun
    minister: socialSupport.minister
      ? formatMinisterName(socialSupport.minister)
      : null,
    numeroPegase: socialSupport.numeroPegase,
    synthesis: socialSupport.synthesis,
    documents: documents || null,
    redirections: redirections || null,
    ...(socialSupport.socialSupportType === 'HelpRequest' && {
      helpRequest: {
        ...commonObjects,
        type: fileInstructionTypeFilterKeys.value(
          socialSupport.fileInstruction?.type
        ),
        isFinancial: socialSupport.fileInstruction?.type === 'Financial',
        isOther: socialSupport.fileInstruction?.type === 'Other',
        subject:
          socialSupport.fileInstruction?.helpRequest?.subject.name || null,
        prescribingOrganization:
          socialSupport.fileInstruction?.helpRequest?.prescribingOrganization
            ?.name,
        prescribingOrganizationContact:
          socialSupport.fileInstruction?.helpRequest
            ?.prescribingOrganizationContact?.name,
        dueDate: socialSupport.dueDate?.toLocaleDateString('fr-FR'),
        handlingDate:
          socialSupport.fileInstruction?.helpRequest?.handlingDate?.toLocaleDateString(),
        fullFile: socialSupport.fileInstruction?.fullFile ? 'oui' : 'non',
        isRefundable: toBooleanLabel(
          socialSupport.fileInstruction?.helpRequest?.isRefundable,
          'Remboursable',
          'Non remboursable'
        ),
        askedAmount: socialSupport.fileInstruction?.helpRequest?.askedAmount,
        allocatedAmount:
          socialSupport.fileInstruction?.helpRequest?.allocatedAmount,
        paymentDate: socialSupport.fileInstruction?.helpRequest?.paymentDate,
        paymentMethod: socialSupport.fileInstruction?.helpRequest?.paymentMethod
      }
    }),

    ...(socialSupport.socialSupportType === 'HelpRequestHousing' && {
      housingHelpRequest: {
        ...commonObjects,
        isFirst: toBooleanLabel(
          socialSupport.fileInstruction?.housingHelpRequest?.isFirst,
          'Oui',
          'Non'
        ),
        firstOpeningDate:
          socialSupport.fileInstruction?.housingHelpRequest?.firstOpeningDate?.toLocaleDateString(
            'fr-FR'
          ),
        askedHousing:
          socialSupport.fileInstruction?.housingHelpRequest?.askedHousing,
        prescribingOrganization:
          socialSupport.fileInstruction?.housingHelpRequest
            ?.prescribingOrganization?.name,
        prescribingOrganizationContact:
          socialSupport.fileInstruction?.housingHelpRequest
            ?.prescribingOrganizationContact?.name,
        reason: housingReasonKeys.value(
          socialSupport.fileInstruction?.housingHelpRequest?.reason
        ),
        uniqueId: socialSupport.fileInstruction?.housingHelpRequest?.uniqueId,

        taxHouseholdAdditionalInformation:
          socialSupport.fileInstruction?.housingHelpRequest
            ?.taxHouseholdAdditionalInformation,
        maxRent: socialSupport.fileInstruction?.housingHelpRequest?.maxRent,
        maxCharges:
          socialSupport.fileInstruction?.housingHelpRequest?.maxCharges,
        housingType:
          socialSupport.fileInstruction?.housingHelpRequest?.housingType
            .map(ht => housingTypeKeys.value(ht))
            .join(', '),
        roomCount: socialSupport.fileInstruction?.housingHelpRequest?.roomCount
          .map(rc => roomCountKeys.value(rc))
          .join(', '),
        lowIncomeHousingType:
          socialSupport.fileInstruction?.housingHelpRequest?.lowIncomeHousingType
            .map(lht => lowIncomeHousingKeys.value(lht))
            .join(', '),
        isPmr: socialSupport.fileInstruction?.housingHelpRequest?.isPmr
          ? 'oui'
          : 'non',
        handlingDate:
          socialSupport.fileInstruction?.housingHelpRequest?.handlingDate?.toLocaleDateString(
            'fr-FR'
          )
      }
    })
  }
}

const getWorkshopData = (workshop: WorkshopWithAttendee) => {
  return {
    id: workshop.id,
    workshopName: workshop.workshopName.name,
    sessionName: workshop.sessionName,
    date: workshop.date.toLocaleDateString('fr-FR'),
    startTime: workshop.startTime,
    endTime: workshop.endTime,
    location: workshop.location,
    partnerOrganizationName: workshop.partnerOrganization?.name,
    host: workshop.host,
    description: workshop.description,
    createdByEmail: workshop.createdBy.email,
    comment: workshop.workshopAttendees[0]?.comment
      ? workshop.workshopAttendees[0].comment
      : undefined,
    attendance: workshop.workshopAttendees[0]?.attendance
      ? workshopAttendeeAttendanceKeys.value(
          workshop.workshopAttendees[0]?.attendance
        )
      : '',
    paymentAmount: workshop.workshopAttendees[0]?.paymentReceived
      ? workshop.workshopAttendees[0].paymentAmount
      : undefined
  }
}

type BeneficiaryRelativeData = FieldLabels<
  Omit<
    BeneficiaryRelative,
    'id' | 'linkedBeneficiaryId' | 'created' | 'updated' | 'beneficiaryId'
  > & { index: number }
>

type FamilyFileBeneficiaryData = {
  firstName: string | null
  usualName: string | null
  relationship: string | null
}

type BeneficiaryInfoData = FieldLabels<Omit<Beneficiary, 'id'>> & {
  beneficiaries: FamilyFileBeneficiaryData[]
  referents: string | null
  relatives: BeneficiaryRelativeData[] | null
}

const getBeneficiaryInfoData = (
  beneficiary: BeneficiaryWithEntourageAndRelative
): BeneficiaryInfoData => {
  const pensionOrganisations = beneficiary.pensionOrganisations.map(item =>
    pensionOrganisationKeys.value(item)
  )
  const beneficiaries = beneficiary.familyFile?.beneficiaries?.map(
    beneficiary => ({
      firstName: beneficiary.firstName,
      usualName: beneficiary.usualName,
      relationship:
        relativeRelationshipKeys.value(beneficiary.relationship) || null
    })
  )
  const referents = beneficiary.familyFile?.referents.map(
    referent => referent.firstName + ' ' + referent.lastName
  )
  const relatives = beneficiary.relatives
    ? beneficiary.relatives.map(
        (relative, idx): BeneficiaryRelativeData => ({
          index: idx + 1,
          additionalInformation: relative.additionalInformation,
          birthDate: relative.birthDate
            ? relative.birthDate.toLocaleDateString('fr-FR')
            : null,
          caregiver: relative.caregiver,
          city: relative.city,
          email: relative.email,
          firstName: relative.firstName,
          lastName: relative.lastName,
          hosted: relative.hosted,
          phone: relative.phone,
          relationship: relative.relationship
            ? relativeRelationshipKeys.value(relative.relationship)
            : null
        })
      )
    : null

  return {
    ...beneficiary,
    beneficiaries,
    relatives,
    referents: referents ? referents.join(', ') : null,
    birthDate: beneficiary.birthDate
      ? beneficiary.birthDate.toLocaleDateString('fr-FR')
      : null,
    divorceDate: beneficiary.divorceDate
      ? beneficiary.divorceDate.toLocaleDateString('fr-FR')
      : null,
    weddingDate: beneficiary.weddingDate
      ? beneficiary.weddingDate.toLocaleDateString('fr-FR')
      : null,
    accommodationMode: beneficiary.accommodationMode
      ? beneficiaryAccommodationModeKeys.value(beneficiary.accommodationMode)
      : null,
    mobility: beneficiary.mobility
      ? beneficiaryMobilityKeys.value(beneficiary.mobility)
      : null,
    familySituation: beneficiary.familySituation
      ? familySituationKeys.value(beneficiary.familySituation)
      : null,
    gir: beneficiary.gir ? beneficiaryGirKeys.value(beneficiary.gir) : null,
    socioProfessionalCategory: beneficiary.socioProfessionalCategory
      ? beneficiarySocioProfessionalCategoryKeys.value(
          beneficiary.socioProfessionalCategory
        )
      : null,
    pensionOrganisations: beneficiary.pensionOrganisations
      ? pensionOrganisations.join(', ')
      : null,
    protectionMeasure: beneficiary.protectionMeasure
      ? beneficiaryProtectionMeasureKeys.value(beneficiary.protectionMeasure)
      : null,
    orientationType: beneficiary.orientationType
      ? beneficiaryOrientationTypeKeys.value(beneficiary.orientationType)
      : null,
    relationship: beneficiary.relationship
      ? relativeRelationshipKeys.value(beneficiary.relationship)
      : null,
    status: beneficiary.status
      ? beneficiaryStatusKeys.value(beneficiary.status)
      : null,
    title: beneficiary.title
      ? beneficiaryTitleKeys.value(beneficiary.title)
      : null,
    gender: beneficiary.gender
      ? beneficiaryGenderKeys.value(beneficiary.gender)
      : null,
    nationality: beneficiary.nationality
      ? nationalityKeys.value(beneficiary.nationality)
      : null,
    studyLevel: beneficiary.studyLevel
      ? beneficiaryStudyLevelKeys.value(beneficiary.studyLevel)
      : null
  }
}

const getCounts = async (
  familyFileId: string,
  beneficiaryId: string,
  user: User
) =>
  await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        familyFileId: familyFileId,
        socialSupportType: 'HelpRequestHousing'
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        familyFileId: familyFileId,
        socialSupportType: 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: true } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        familyFileId: familyFileId,
        socialSupportType: 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: false } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        familyFileId: familyFileId,
        socialSupportType: 'Followup'
      }
    }),
    WorkshopRepo.count(user, {
      where: {
        workshopAttendees: {
          some: {
            beneficiaryId: beneficiaryId
          }
        }
      }
    })
  ])

const getBeneficaryDetails = async (id: string, user: SecurityRuleGrantee) => {
  return await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: id },
    select: {
      id: true,
      structureId: true,
      familyFileId: true,
      previousFamilyFileId: true,
      createdById: true,
      disabledById: true,
      splitFromFileById: true,
      aidantConnectAuthorized: true,
      fileNumber: true,
      status: true,
      title: true,
      usualName: true,
      usualNameNormalized: true,
      birthName: true,
      birthNameNormalized: true,
      firstName: true,
      firstNameNormalized: true,
      birthDate: true,
      birthPlace: true,
      deathDate: true,
      gender: true,
      nationality: true,
      accommodationMode: true,
      accommodationName: true,
      accommodationAdditionalInformation: true,
      street: true,
      addressComplement: true,
      zipcode: true,
      city: true,
      department: true,
      region: true,
      qpv: true,
      noPhone: true,
      phone1: true,
      phone2: true,
      email: true,
      familySituation: true,
      weddingDate: true,
      divorceDate: true,
      caregiver: true,
      minorChildren: true,
      majorChildren: true,
      mobility: true,
      vulnerablePerson: true,
      relationship: true,
      ministereCategorie: true,
      ministereDepartementServiceAc: true,
      ministereStructure: true,
      gir: true,
      doctor: true,
      healthAdditionalInformation: true,
      socialSecurityNumber: true,
      insurance: true,
      socioProfessionalCategory: true,
      schoolName: true,
      isSchoolInQPV: true,
      studyLevel: true,
      occupation: true,
      employer: true,
      employerSiret: true,
      unemploymentNumber: true,
      pensionOrganisations: true,
      otherPensionOrganisations: true,
      cafNumber: true,
      bank: true,
      funeralContract: true,
      protectionMeasure: true,
      representative: true,
      prescribingStructure: true,
      orientationType: true,
      orientationStructure: true,
      serviceProviders: true,
      involvedPartners: true,
      additionalInformation: true,
      numeroPegase: true,
      accommodationZone: true,
      externalRdvspId: true,
      created: true,
      updated: true,
      archiveDueDate: true,
      archiveDueDateHistory: true,
      lastActivity: true,
      relatives: {
        select: {
          firstName: true,
          lastName: true,
          relationship: true,
          city: true,
          email: true,
          phone: true,
          hosted: true,
          caregiver: true,
          additionalInformation: true,
          birthDate: true
        }
      },
      familyFile: {
        select: {
          referents: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          beneficiaries: {
            where: { NOT: { id: id } },
            select: {
              firstName: true,
              usualName: true,
              relationship: true
            }
          }
        }
      }
    }
  })
}

const getSocialSupports = async (
  familyFileId: string,
  beneficiaryId: string,
  user: User
) => {
  return await SocialSupportRepo.findMany(user, {
    where: {
      familyFileId: familyFileId,
      beneficiaryId: beneficiaryId,
      socialSupportType: { not: 'Appointment' }
    },
    select: {
      id: true,
      socialSupportType: true,
      date: true,
      numeroPegase: true,
      status: true,
      dueDate: true,
      synthesis: true,
      followup: {
        select: {
          firstFollowup: true,
          duration: true,
          medium: true,
          thirdPersonName: true,
          place: true,
          forwardedToJustice: true,
          helpRequested: true,
          classified: true,
          prescribingOrganization: {
            select: {
              name: true
            }
          },
          prescribingOrganizationContact: {
            select: {
              name: true
            }
          }
        }
      },
      fileInstruction: {
        select: {
          externalStructure: true,
          fullFile: true,
          dispatchDate: true,
          examinationDate: true,
          decisionDate: true,
          type: true,
          refusalReason: true,
          refusalReasonOther: true,
          instructorOrganization: {
            select: {
              name: true
            }
          },
          instructorOrganizationContact: {
            select: {
              name: true
            }
          },
          helpRequest: {
            select: {
              subject: {
                select: {
                  name: true
                }
              },
              prescribingOrganization: {
                select: {
                  name: true
                }
              },
              prescribingOrganizationContact: {
                select: {
                  name: true
                }
              },
              handlingDate: true,
              isRefundable: true,
              askedAmount: true,
              allocatedAmount: true,
              paymentDate: true,
              paymentMethod: true
            }
          },
          housingHelpRequest: {
            select: {
              prescribingOrganization: {
                select: {
                  name: true
                }
              },
              prescribingOrganizationContact: {
                select: {
                  name: true
                }
              },
              isFirst: true,
              firstOpeningDate: true,
              askedHousing: true,
              uniqueId: true,
              taxHouseholdAdditionalInformation: true,
              maxRent: true,
              maxCharges: true,
              housingType: true,
              roomCount: true,
              lowIncomeHousingType: true,
              isPmr: true,
              reason: true,
              handlingDate: true
            }
          }
        }
      },
      minister: {
        select: {
          firstName: true,
          lastName: true,
          function: true,
          government: true
        }
      },
      documents: {
        select: { name: true, type: true }
      },
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      lastUpdatedBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      subjects: {
        select: { name: true }
      },
      socialSupportRedirections: {
        select: {
          type: true,
          motif: true,
          externalStructureName: true,
          partnerOrganization: { select: { name: true } },
          partnerOrganizationContact: { select: { name: true } }
        }
      }
    },
    orderBy: [{ date: 'desc' }, { created: 'desc' }]
  })
}

const getWorkshops = async (beneficiaryId: string, user: User) => {
  return await WorkshopRepo.findMany(user, {
    where: {
      workshopAttendees: {
        some: {
          beneficiaryId: beneficiaryId
        }
      }
    },
    select: {
      id: true,
      workshopName: { select: { name: true } },
      sessionName: true,
      date: true,
      startTime: true,
      endTime: true,
      location: true,
      partnerOrganization: {
        select: {
          name: true
        }
      },
      host: true,
      description: true,
      createdBy: {
        select: {
          email: true
        }
      },
      createdAt: true,
      workshopAttendees: {
        where: {
          beneficiaryId: beneficiaryId
        },
        select: {
          attendance: true,
          comment: true,
          paymentAmount: true,
          paymentReceived: true
        }
      }
    },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
  })
}

const getPrettyUserName = (
  user: Pick<User, 'firstName' | 'lastName' | 'email'> | null
) => {
  if (!user) {
    return null
  }
  const name = []
  if (user.firstName) {
    name.push(user.firstName)
  }
  if (user.lastName) {
    name.push(user.lastName)
  }
  if (user.email) {
    name.push(user.email)
  }
  return name.join(' ')
}

type SocialSupportWithFollowupAndSubject = Awaited<
  ReturnType<typeof getSocialSupports>
>
type SocialSupportItem = SocialSupportWithFollowupAndSubject[0]
type BeneficiaryWithEntourageAndRelative = Awaited<
  ReturnType<typeof getBeneficaryDetails>
>

type WorkshopWithAttendee = Awaited<ReturnType<typeof getWorkshops>>[0]
