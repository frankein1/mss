import { randomBytes } from 'node:crypto'
import type { DocumentType } from '@prisma/client'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesUsers,
  FixtureUserRole
} from './fixtures'
import { prismaClient } from '~/server/prisma'

const N_DOCUMENTS = 1000

const SAMPLES = [
  { name: 'attestation-caf.pdf', bytes: 204_800, mimeType: 'application/pdf' },
  {
    name: 'justificatif-domicile.pdf',
    bytes: 512_000,
    mimeType: 'application/pdf'
  },
  { name: 'photo-identite.jpg', bytes: 819_200, mimeType: 'image/jpeg' },
  {
    name: 'cerfa-aide-sociale.pdf',
    bytes: 1_048_576,
    mimeType: 'application/pdf'
  },
  { name: 'plan-logement.png', bytes: 1_536_000, mimeType: 'image/png' },
  { name: 'rapport-social.pdf', bytes: 2_097_152, mimeType: 'application/pdf' }
]

const DOCUMENT_TYPES: DocumentType[] = [
  'Cerfa',
  'HistoriqueCourrier',
  'Justificatifs',
  'Rapports'
]

const BENEFICIARY_IDS = [
  fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
  fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
  fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
  fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
  fixturesBeneficiaries[FixtureBeneficiary.PISCOPO].id,
  fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
]

const CREATED_BY_ID = fixturesUsers[FixtureUserRole.StructureManager].id

const sampleContents = SAMPLES.map(s => randomBytes(s.bytes))

function buildDocumentData() {
  return Array.from({ length: N_DOCUMENTS }, (_, i) => {
    const sample = SAMPLES[i % SAMPLES.length]!
    const beneficiaryId = BENEFICIARY_IDS[i % BENEFICIARY_IDS.length]!
    const ext = sample.name.split('.').pop()
    const name = `${sample.name.replace(`.${ext}`, '')}-${i}.${ext}`

    return {
      key: crypto.randomUUID(),
      createdById: CREATED_BY_ID,
      familyFileId: beneficiaryId,
      beneficiaryId,
      name,
      filenameDisk: name,
      filenameDownload: name,
      type: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length]!,
      confidential: i % 2 === 0,
      tags: [],
      size: sample.bytes,
      mimeType: sample.mimeType,
      migrated: false
    }
  })
}

async function main() {
  const docData = buildDocumentData()

  console.log(`Create ${N_DOCUMENTS} documents`)
  await prismaClient.document.createMany({ data: docData })

  console.log('Create document contents in chunks')
  const chunkSize = 10
  for (let i = 0; i < docData.length; i += chunkSize) {
    const chunk = docData.slice(i, i + chunkSize)
    await prismaClient.documentContent.createMany({
      data: chunk.map(({ key }, j) => ({
        id: crypto.randomUUID(),
        documentKey: key,
        content: sampleContents[
          (i + j) % sampleContents.length
        ]! as Uint8Array<ArrayBuffer>
      }))
    })
    if ((i / chunkSize) % 20 === 0) {
      console.log(
        `  chunk ${i / chunkSize + 1}/${Math.ceil(docData.length / chunkSize)}`
      )
    }
  }

  console.log(
    `Seeded ${N_DOCUMENTS} documents across ${BENEFICIARY_IDS.length} beneficiaries`
  )
}

;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await prismaClient.$disconnect()
    process.exit(1)
  })
)

main().finally(() => prismaClient.$disconnect())
