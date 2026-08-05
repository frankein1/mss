import type { Prisma } from '@prisma/client'
import { v4 } from 'uuid'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesUsers,
  FixtureUserRole
} from './fixtures'
import { fakerFR as faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import fs from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { prismaClient } from '~/server/prisma'

const N_DOCUMENTS = 1000

const ID_JEANNE_RESPONSABLE = fixturesUsers[FixtureUserRole.StructureManager].id
const ID_PISCOPO = fixturesBeneficiaries[FixtureBeneficiary.PISCOPO].id

/** Seed N_DOCUMENTS in Database with format pdf */
async function main() {
  const docData = new Array(N_DOCUMENTS).fill(null).map(() => {
    const name = `${faker.word.sample()}_${nanoid(6)}.pdf`
    return {
      key: v4(),
      createdById: ID_JEANNE_RESPONSABLE,
      familyFileId: ID_PISCOPO,
      beneficiaryId: ID_PISCOPO,
      name,
      filenameDisk: name,
      filenameDownload: name,
      type: 'Cerfa',
      confidential: true,
      tags: [],
      size: 2258545,
      mimeType: 'application/pdf',
      migrated: false // stored in database
    } satisfies Prisma.DocumentCreateManyInput
  })

  console.log('Create documents')
  let start = performance.now()
  const documents = await prismaClient.document.createManyAndReturn({
    select: { key: true },
    data: docData
  })
  let end = performance.now()
  console.log(`creation documents ${(end - start) / 1000}s`)

  const content = await readFile('./prisma/fixtures/test_document_for_seed.pdf')

  // Create in chunks
  start = performance.now()
  const chunkSize = 10
  const nChuncks =
    N_DOCUMENTS / chunkSize + (N_DOCUMENTS % chunkSize === 0 ? 0 : 1)
  for (let ichunk = 0; ichunk < nChuncks; ichunk++) {
    console.log(
      `Create document content for chunk ${ichunk} of ${nChuncks} duration ${(performance.now() - start) / 1000}s`
    )
    const istart = ichunk * chunkSize
    const contentData = documents
      .slice(istart, istart + chunkSize)
      .map(({ key }) => {
        return {
          id: v4(),
          documentKey: key,
          content: Buffer.from(content)
        } satisfies Prisma.DocumentContentCreateManyInput
      })

    await prismaClient.documentContent.createMany({
      data: contentData
    })
  }

  end = performance.now()
  console.log(`creation document content ${(end - start) / 1000}s`)

  return
}

async function readFile(filepath: string) {
  const data = await fs.readFile(filepath)
  return data
}

;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await cleanup()
    process.exit(1)
  })
)

async function cleanup() {
  await prismaClient.$disconnect()
}

main().finally(cleanup)
