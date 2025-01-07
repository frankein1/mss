import fs from 'fs'
import path from 'path'
import puppeteer, { PDFOptions } from 'puppeteer'
import hbs from 'handlebars'
import JSZip from 'jszip'
import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, UserRepo, SocialSupportRepo } from '~/server/database'
import { archiveReasonKeys, ArchiveReasons } from '~/client/options/archive'

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
  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: {
      familyFileId: beneficiaryDetails.familyFileId
    },
    include: {
      createdBy: true,
      lastUpdatedBy: true,
      familyFile: {
        include: {
          referents: true
        }
      },
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

  // Informations Page
  const informationsData = {
    name: beneficiaryDetails.firstName + ' ' + beneficiaryDetails.usualName,
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
  const informationContent = await compile(
    'handlebars-templates/informations-template.hbs',
    informationsData
  )

  const informationsPage = await browser.newPage()
  await informationsPage.setContent(informationContent)
  await informationsPage.emulateMediaType('screen')
  await informationsPage.goto('data:text/html,' + informationContent, {
    waitUntil: 'networkidle0'
  })
  const informationsPdfBuffer = await informationsPage.pdf(pdfOptions)

  // SocialSupports pages (Test with 1 page)
  const socialSupportContent = await compile(
    'handlebars-templates/followup-template.hbs',
    {
      name: beneficiaryDetails.firstName + ' ' + beneficiaryDetails.usualName,
      socialSupport: socialSupports[0]
    }
  )
  const socialSupportPage = await browser.newPage()
  await socialSupportPage.setContent(socialSupportContent)
  await socialSupportPage.emulateMediaType('screen')
  await socialSupportPage.goto('data:text/html,' + socialSupportContent, {
    waitUntil: 'networkidle0'
  })
  const socialSuportPdfBuffer = await socialSupportPage.pdf(pdfOptions)

  // create zip file
  const zip = new JSZip()
  zip.file('Informations.pdf', informationsPdfBuffer, { binary: true })
  zip.file('Historique/socialSupport1.pdf', socialSuportPdfBuffer, {
    binary: true
  })
  zip.file('Historique/socialSupport2.pdf', socialSuportPdfBuffer, {
    binary: true
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
