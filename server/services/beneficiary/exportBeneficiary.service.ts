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
  pensionOrganisationKeys,
  followupKeys,
  fileInstructionStatusKeys,
  ministryFileInstructionStatusKeys,
  ministrySocialSupportStatusKeys,
  socialSupportStatusKeys,
  typeSuiviKeys
} from '~/client/options'
import {
  followupFieldLabels,
  helpRequestFieldLabels,
  housingHelpRequestFieldLabels
} from '~/client/labels'
import { buildKeys, Keys } from '~/utils/keys/keyBuilder'

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
    await getCounts(beneficiaryDetails.familyFileId, user)

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

  // Followups pages
  const followups = await Promise.all(
    socialSupports
      .filter(socialSupport => socialSupport.socialSupportType === 'Followup')
      .map(async (followup, idx) => {
        const content = await compile(
          'handlebars-templates/social-support-template.hbs',
          {
            beneficiaryName: getBeneficiaryName(beneficiaryDetails),
            ...convertSocialSupport(followup)
          }
        )
        const page = await browser.newPage()
        await page.setContent(content)
        await page.emulateMediaType('screen')
        await page.goto('data:text/html,' + content, {
          waitUntil: 'networkidle0'
        })

        return {
          filename: `Historique/entretiens_${idx + 1}.pdf`,
          buffer: await page.pdf(pdfOptions)
        }
      })
  )

  // Helprequests pages
  const helpRequests = await Promise.all(
    socialSupports
      .filter(
        socialSupport =>
          socialSupport.socialSupportType === 'HelpRequest' ||
          socialSupport.socialSupportType === 'HelpRequestHousing'
      )
      .map(async (helpRequest, idx) => {
        const content = await compile(
          'handlebars-templates/social-support-template.hbs',
          {
            beneficiaryName: getBeneficiaryName(beneficiaryDetails),
            ...convertSocialSupport(helpRequest)
          }
        )
        const page = await browser.newPage()
        await page.setContent(content)
        await page.emulateMediaType('screen')
        await page.goto('data:text/html,' + content, {
          waitUntil: 'networkidle0'
        })

        return {
          filename: `Historique/instruction_de_dossier_${idx + 1}.pdf`,
          buffer: await page.pdf(pdfOptions)
        }
      })
  )

  // create zip file
  const zip = new JSZip()

  zip.file('Résumé_archive.pdf', abstractPdfBuffer, { binary: true })
  followups.forEach(followup => {
    zip.file(followup.filename, followup.buffer, {
      binary: true
    })
  })
  helpRequests.forEach(helprequest => {
    zip.file(helprequest.filename, helprequest.buffer, {
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
    initialsocialSupports: socialSupports,
    socialSupports: socialSupports.map(socialsupport =>
      convertSocialSupport(socialsupport)
    )
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
    select: {
      id: false,
      date: true,
      status: true,
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
      ministre: true,
      numeroPegase: true,
      dueDate: true,
      socialSupportType: true,
      subjects: {
        select: {
          name: true
        }
      },
      fileInstruction: {
        select: {
          decisionDate: true,
          dispatchDate: true,
          examinationDate: true,
          externalStructure: true,
          fullFile: true,
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
          helpRequest: true,
          housingHelpRequest: {
            select: {
              askedHousing: true,
              firstOpeningDate: true,
              housingType: true,
              isFirst: true,
              isPmr: true,
              lowIncomeHousingType: true,
              maxCharges: true,
              maxRent: true,
              reason: true,
              roomCount: true,
              taxHouseholdAdditionalInformation: true,
              uniqueId: true,
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
          }
        }
      },
      followup: {
        select: {
          firstFollowup: true,
          id: false,
          updated: true,
          medium: true,
          place: true,
          thirdPersonName: true, //'Tierce personne'
          duration: true,
          forwardedToJustice: true, // Transmis à la justice
          redirected: true, // Réorienté après l'entretien
          structureName: true, // Nom de l'organisme
          helpRequested: true, // Instruction de dossier
          classified: true, // Classé
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
      documents: {
        select: { name: true, type: true }
      },
      synthesis: true,
      privateSynthesis: true
    },
    orderBy: [{ date: 'desc' }, { created: 'desc' }]
  })
}

const getCounts = async (familyFileId: string, user: User) =>
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
    })
  ])

const convertSocialSupport = (initialSocialSupport: SocialSupportItem) => {
  const socialSupport = getKeys(
    convertToLabelValueArray(initialSocialSupport),
    helpRequestFieldLabels,
    socialSupportKeys()
  )
  socialSupport?.push({
    label: 'Créé par',
    value: `${initialSocialSupport.createdBy.firstName} ${initialSocialSupport.createdBy.lastName} ${initialSocialSupport.createdBy.email}`
  })
  if (initialSocialSupport.lastUpdatedBy) {
    socialSupport?.push({
      label: 'Dernière mise à jour par',
      value: `${initialSocialSupport.lastUpdatedBy.firstName} ${initialSocialSupport.lastUpdatedBy.lastName} ${initialSocialSupport.lastUpdatedBy.email}`
    })
  }
  const fileInstruction = getKeys(
    convertToLabelValueArray(initialSocialSupport?.fileInstruction),
    helpRequestFieldLabels,
    socialSupportKeys()
  )
  const helpRequest = getKeys(
    convertToLabelValueArray(
      initialSocialSupport?.fileInstruction?.helpRequest
    ),
    helpRequestFieldLabels,
    socialSupportKeys()
  )
  const housingHelpRequest = getKeys(
    convertToLabelValueArray(
      initialSocialSupport?.fileInstruction?.housingHelpRequest
    ),
    housingHelpRequestFieldLabels,
    socialSupportKeys()
  )
  const followup = getKeys(
    convertToLabelValueArray(initialSocialSupport?.followup),
    followupFieldLabels,
    socialSupportKeys()
  )

  if (
    fileInstruction &&
    initialSocialSupport?.fileInstruction?.instructorOrganization
  ) {
    fileInstruction.push({
      label: 'Organisme instructeur',
      value: initialSocialSupport.fileInstruction.instructorOrganization.name
    })
  }
  if (
    fileInstruction &&
    initialSocialSupport?.fileInstruction?.instructorOrganizationContact
  ) {
    fileInstruction.push({
      label: "Contact de l'organisme instructeur",
      value:
        initialSocialSupport.fileInstruction.instructorOrganizationContact.name
    })
  }
  if (
    housingHelpRequest &&
    initialSocialSupport?.fileInstruction?.housingHelpRequest
      ?.prescribingOrganization
  ) {
    housingHelpRequest.push({
      label: 'Organisme prescripteur',
      value:
        initialSocialSupport.fileInstruction.housingHelpRequest
          .prescribingOrganization.name
    })
  }

  if (
    housingHelpRequest &&
    initialSocialSupport?.fileInstruction?.housingHelpRequest
      ?.prescribingOrganizationContact
  ) {
    housingHelpRequest.push({
      label: "Contact de l'organisme prescripteur",
      value:
        initialSocialSupport.fileInstruction.housingHelpRequest
          ?.prescribingOrganizationContact.name
    })
  }

  if (
    followup &&
    initialSocialSupport?.followup &&
    initialSocialSupport?.followup.prescribingOrganization
  ) {
    followup.push({
      label: 'Organisme prescripteur',
      value: initialSocialSupport.followup.prescribingOrganization.name
    })
  }
  if (
    followup &&
    initialSocialSupport?.followup &&
    initialSocialSupport?.followup.prescribingOrganizationContact
  ) {
    followup.push({
      label: "Contact de l'organisme prescripteur",
      value: initialSocialSupport.followup.prescribingOrganizationContact.name
    })
  }

  const subjects = initialSocialSupport.subjects.map(subject => subject.name)

  return {
    socialSupport,
    fileInstruction,
    helpRequest,
    housingHelpRequest,
    followup,
    subjects,
    documents: initialSocialSupport.documents
  }
}

type SocialSupportWithFollowupAndSubject = Awaited<
  ReturnType<typeof getSocialSupports>
>
type SocialSupportItem = SocialSupportWithFollowupAndSubject[0]
type BeneficiaryWithEntourageAndRelative = Awaited<
  ReturnType<typeof getBeneficaryDetails>
>

const getKeys = (
  obj:
    | {
        label: string
        value: string | string[]
      }[]
    | null,
  fieldLabels: any,
  keys: Keys
) => {
  if (obj == null) {
    return null
  }

  return obj.map(item => {
    if (typeof item.value == 'boolean') {
      return {
        label: fieldLabels[item.label] ? fieldLabels[item.label] : item.label,
        value: item.value ? 'oui' : 'non'
      }
    }
    if (
      Array.isArray(item.value) &&
      item.label !== 'documents' &&
      item.label !== 'subjects'
    ) {
      const convertedValues = item.value.map(value => {
        return keys.byKey[value] ? keys.byKey[value] : value
      })
      return {
        label: fieldLabels[item.label] ? fieldLabels[item.label] : item.label,
        value: convertedValues.join(', ')
      }
    }
    if (!Array.isArray(item.value)) {
      return {
        label: fieldLabels[item.label] ? fieldLabels[item.label] : item.label,
        value: keys.byKey[item.value] ? keys.byKey[item.value] : item.value
      }
    }
  })
}

const convertToLabelValueArray = (
  obj: Record<string, any> | null | undefined
): { label: string; value: any }[] | null => {
  if (obj == null) {
    return null
  }
  const result: { label: string; value: any }[] = []

  const recurse = (currentObj: Record<string, any>): void => {
    for (const key in currentObj) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        const value = currentObj[key]
        if (value instanceof Date) {
          result.push({ label: key, value: value.toLocaleDateString() })
        }
        if (Array.isArray(value)) {
          result.push({ label: key, value })
        } else if (typeof value != 'object') {
          result.push({ label: key, value })
        }
      }
    }
  }
  recurse(obj)
  return result
}

const socialSupportKeys = () => {
  return buildKeys({
    ...typeSuiviKeys.byKey,
    ...fileInstructionStatusKeys.byKey,
    ...ministryFileInstructionStatusKeys.byKey,
    ...socialSupportStatusKeys.byKey,
    ...ministrySocialSupportStatusKeys.byKey,
    ...followupKeys().byKey
  })
}
