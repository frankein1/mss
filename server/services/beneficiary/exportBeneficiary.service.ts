import fs from 'fs'
import path from 'path'
import puppeteer, { PDFOptions } from 'puppeteer'
import hbs from 'handlebars'
import JSZip from 'jszip'
import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import { BeneficiaryRepo, UserRepo, SocialSupportRepo } from '~/server/database'
import { Beneficiary, User } from '@prisma/client'
import {
  documentTypeKeys,
  ministerKeys,
  followupDurationKeys,
  followupMediumKeys,
  followupStatusKeys,
  archiveReasonKeys,
  ArchiveReasons,
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
  pensionOrganisationKeys
} from '~/client/options'

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

  const socialSupports = await getSocialSupports(
    beneficiaryDetails.familyFileId,
    user
  )

  const [housingCount, financialCount, otherCount, followupCount] =
    await Promise.all([
      SocialSupportRepo.count(user, {
        where: {
          familyFileId: beneficiaryDetails.familyFileId,
          socialSupportType: 'HelpRequestHousing'
        }
      }),
      SocialSupportRepo.count(user, {
        where: {
          familyFileId: beneficiaryDetails.familyFileId,
          socialSupportType: 'HelpRequest',
          fileInstruction: { helpRequest: { financialSupport: true } }
        }
      }),
      SocialSupportRepo.count(user, {
        where: {
          familyFileId: beneficiaryDetails.familyFileId,
          socialSupportType: 'HelpRequest',
          fileInstruction: { helpRequest: { financialSupport: false } }
        }
      }),
      SocialSupportRepo.count(user, {
        where: {
          familyFileId: beneficiaryDetails.familyFileId,
          socialSupportType: 'Followup'
        }
      })
    ])

  // handlebars -> https://github.com/ankur20us/demo-puppeteer/blob/master/index.js
  // API puppeteer https://pptr.dev/api/puppeteer.puppeteernode

  const browser = await puppeteer.launch()

  // Abstract Page
  const abstractData = {
    name: getBeneficiaryName(beneficiaryDetails),
    birthDate: beneficiaryDetails.birthDate?.toLocaleDateString(),
    created: beneficiaryDetails.created?.toLocaleDateString(),
    archivedDate: new Date().toLocaleDateString(),
    userName: user.firstName + ' ' + user.lastName,
    reason: {
      completed: input.reason != null || input.clarification != null,
      reason: input.reason
        ? archiveReasonKeys.byKey[input.reason as ArchiveReasons]
        : null,
      date: input.date,
      clarification: input.clarification
    },
    counts: {
      totalHelpRequestCount: housingCount + financialCount + otherCount,
      housingCount,
      financialCount,
      otherCount,
      followupCount
    }
  }
  const abstractContent = await compile(
    'handlebars-templates/abstract-template.hbs',
    abstractData
  )
  const abstractPage = await browser.newPage()
  await abstractPage.setContent(abstractContent)
  await abstractPage.emulateMediaType('screen')
  await abstractPage.goto('data:text/html,' + abstractContent, {
    waitUntil: 'networkidle0'
  })
  const abstractPdfBuffer = await abstractPage.pdf(pdfOptions)

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
  const infoPage = await browser.newPage()
  await infoPage.setContent(informationsContent)
  await infoPage.emulateMediaType('screen')
  await infoPage.goto('data:text/html,' + informationsContent, {
    waitUntil: 'networkidle0'
  })
  const infoPdfBuffer = await infoPage.pdf(pdfOptions)

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

        const page = await browser.newPage()
        await page.setContent(content)
        await page.emulateMediaType('screen')
        await page.goto('data:text/html,' + content, {
          waitUntil: 'networkidle0'
        })

        return {
          filename: `Historique/entretiens_${followup.id}.pdf`,
          buffer: await page.pdf(pdfOptions)
        }
      })
  )

  // create zip file
  const zip = new JSZip()
  zip.file('Résumé_archive.pdf', abstractPdfBuffer, { binary: true })
  zip.file(
    `Informations/${getBeneficiaryName(beneficiaryDetails)}.pdf`,
    infoPdfBuffer,
    { binary: true }
  )
  followups.forEach(followup => {
    zip.file(followup.filename, followup.buffer, {
      binary: true
    })
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
    archiveFile,
    beneficiaryDetails
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

const pdfOptions: PDFOptions = {
  format: 'A4',
  landscape: false,
  scale: 1,
  printBackground: true,
  margin: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }
}

const getBeneficiaryName = (beneficiary: Beneficiary) => {
  return beneficiary.firstName + ' ' + beneficiary.usualName
}
const getFollowupData = (socialSupport: SocialSupportItem) => {
  const subjectsNames = socialSupport.subjects.map(subject => subject.name)
  const documents = socialSupport.documents?.map(document => ({
    name: document.name,
    type: documentTypeKeys.value(document.type)
  }))
  return {
    createdByEmail: socialSupport.createdBy?.email,
    lastUpdatedByEmail: socialSupport.lastUpdatedBy?.email,
    firstFollowup: socialSupport.followup?.firstFollowup || null,
    date: socialSupport.date.toLocaleDateString(),
    ministre: socialSupport.ministre
      ? ministerKeys.value(socialSupport.ministre)
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
    dueDate: socialSupport.dueDate,
    prescribingOrganizationName:
      socialSupport.followup?.prescribingOrganization?.name,
    prescribingOrganizationContact:
      socialSupport.followup?.prescribingOrganizationContact?.name,
    synthesis: socialSupport.synthesis,
    actions:
      socialSupport.followup?.forwardedToJustice != null ||
      socialSupport.followup?.redirected != null,
    forwardedToJustice: socialSupport.followup?.forwardedToJustice,
    redirected: socialSupport.followup?.redirected,
    structureName: socialSupport.followup?.structureName,
    documents: documents || null
  }
}

const getBeneficiaryInfoData = (
  beneficiary: BeneficiaryWithEntourageAndRelative
) => {
  const pensionOrganisations = beneficiary.pensionOrganisations.map(item =>
    pensionOrganisationKeys.value(item)
  )
  const beneficiaries = beneficiary.familyFile?.beneficiaries?.map(
    beneficiary => ({
      firstName: beneficiary.firstName,
      usualName: beneficiary.usualName,
      relationship: beneficiary.relationship
        ? relativeRelationshipKeys.value(beneficiary.relationship)
        : null
    })
  )
  const referents = beneficiary.familyFile?.referents.map(
    referent => referent.firstName + ' ' + referent.lastName
  )
  const relatives = beneficiary.relatives
    ? beneficiary.relatives.map((relative, idx) => ({
        index: idx + 1,
        additionalInformation: relative.additionalInformation,
        birthDate: relative.birthDate
          ? relative.birthDate.toLocaleDateString()
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
      }))
    : null

  return {
    ...beneficiary,
    beneficiaries,
    relatives,
    referents: referents ? referents.join(', ') : null,
    birthDate: beneficiary.birthDate
      ? beneficiary.birthDate.toLocaleDateString()
      : null,
    divorceDate: beneficiary.divorceDate
      ? beneficiary.divorceDate.toLocaleDateString()
      : null,
    weddingDate: beneficiary.weddingDate
      ? beneficiary.weddingDate.toLocaleDateString()
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
    studyLevel: beneficiary.studyLevel
      ? beneficiaryStudyLevelKeys.value(beneficiary.studyLevel)
      : null
  }
}

const getBeneficaryDetails = async (id: string, user: SecurityRuleGrantee) => {
  return await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: id },
    include: {
      relatives: true,
      familyFile: {
        select: {
          referents: true,
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

const getSocialSupports = async (familyFileId: string, user: User) => {
  return await SocialSupportRepo.findMany(user, {
    where: {
      familyFileId: familyFileId
    },
    include: {
      followup: {
        include: {
          prescribingOrganization: true,
          prescribingOrganizationContact: true
        }
      },
      documents: {
        select: { name: true, type: true }
      },
      createdBy: true,
      lastUpdatedBy: true,
      subjects: true
    },
    orderBy: [{ date: 'desc' }, { created: 'desc' }]
  })
}

type SocialSupportWithFollowupAndSubject = Awaited<
  ReturnType<typeof getSocialSupports>
>
type SocialSupportItem = SocialSupportWithFollowupAndSubject[0]
type BeneficiaryWithEntourageAndRelative = Awaited<
  ReturnType<typeof getBeneficaryDetails>
>
