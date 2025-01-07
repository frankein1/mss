import fs from 'fs'
import path from 'path'
import puppeteer, { PDFOptions } from 'puppeteer'
import hbs from 'handlebars'
import JSZip from 'jszip'
import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, UserRepo, SocialSupportRepo } from '~/server/database'
import {
  Beneficiary,
  Followup,
  PartnerOrganization,
  PartnerOrganizationContact,
  SocialSupport,
  SocialSupportSubject,
  User
} from '@prisma/client'

import {
  documentTypeKeys,
  ministerKeys,
  followupDurationKeys,
  followupMediumKeys,
  followupStatusKeys,
  archiveReasonKeys,
  ArchiveReasons
} from '~/client/options'

export const exportBeneficiary = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiaryInput
}) => {
  const beneficiaryDetails = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId }
  })
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.user.id }
  })

  // TODO: use select and create a function + get the type of the return value
  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: {
      familyFileId: beneficiaryDetails.familyFileId
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
  zip.file('Informations.pdf', abstractPdfBuffer, { binary: true })
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
    socialSupports
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
const getFollowupData = (
  socialSupport: SocialSupportWithFollowupAndSubject
) => {
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

type SocialSupportWithFollowupAndSubject = SocialSupport & {
  followup: FollowupWithPrescribingOrganization | null
  subjects: SocialSupportSubject[]
  createdBy: User | null
  lastUpdatedBy: User | null
  documents:
    | {
        name: string
        type: string
      }[]
    | null
}
type FollowupWithPrescribingOrganization = Followup & {
  prescribingOrganization: PartnerOrganization | null
  prescribingOrganizationContact: PartnerOrganizationContact | null
}
