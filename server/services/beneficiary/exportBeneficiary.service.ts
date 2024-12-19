import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import {
  BeneficiaryRepo,
  UserRepo,
  FollowupRepo,
  SocialSupportRepo
} from '~/server/database'
import puppeteer from 'puppeteer'
import hbs from 'handlebars'
// import fs from 'fs-extra'
// import path from 'path'
import * as path from 'node:path'
import * as fs from 'node:fs'
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

  // la fiche pdf récapitulative de l'archivage (qui a archivé, quelle date, le motif de l'archivage,
  // la date d'ouverture du dossier, nombre de suivis). Nom du fichier : Résumé_archive

  // PUPPETEER
  // TODO
  // - Générer du html dynamique (avec pug, handlebars...)
  //    - handlebars -> https://github.com/ankur20us/demo-puppeteer/blob/master/index.js
  //    - pug (beta.gouv mon-aide-cyber) -> https://github.com/betagouv/mon-aide-cyber/blob/main/mon-aide-cyber-api/src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF.ts#L159
  //    - https://github.com/wuno/wuno-pdf-generator/tree/master
  //    - https://github.com/wuno/wuno-pdf-generator/blob/master/server/controllers/pdf.js
  // - Générer plusieurs pages HTML -> plusieurs PDFs
  //    - API puppeteer https://pptr.dev/api/puppeteer.puppeteernode

  const hbsData = {
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
  const content = await compile(
    'handlebars-templates/abstract-template.hbs',
    hbsData
  )
  const browser = await puppeteer.launch()
  const pageOne = await browser.newPage()
  await pageOne.setContent(content)
  await pageOne.emulateMediaType('screen')
  await pageOne.goto('data:text/html,' + content, {
    waitUntil: 'networkidle0'
  })
  const byteArray = await pageOne.pdf({
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
  })

  const data = uint8ArrayToBase64(byteArray, 'application/pdf')

  return {
    data,
    beneficiaryDetails,
    counts: { housingCount, financialCount, otherCount, followupCount }
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
