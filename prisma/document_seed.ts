import { PrismaClient, type Prisma } from '@prisma/client'
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

const prismaClient = new PrismaClient()

const N_DOCUMENTS = 1000

const ID_JEANNE_RESPONSABLE = fixturesUsers[FixtureUserRole.StructureManager].id
const ID_PISCOPO = fixturesBeneficiaries[FixtureBeneficiary.PISCOPO].id

async function main() {
  const docData = new Array(N_DOCUMENTS).fill(null).map(() => {
    const name = `${faker.word.sample()}_${nanoid(6)}.pdf`
    return {
      key: v4(),
      createdById: ID_JEANNE_RESPONSABLE,
      familyFileId: ID_PISCOPO,
      beneficiaryId: ID_PISCOPO,
      name: `${faker.word.sample()}_${nanoid(6)}.pdf`,
      filenameDisk: name,
      filenameDownload: name,
      type: 'Cerfa',
      confidential: true,
      tags: [],
      size: 71050,
      mimeType: 'application/png',
      migrated: false // migrated to S3
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

  const content = await readFile('./test_file_71kB.png')

  const contentData = documents.map(({ key }) => {
    return {
      id: v4(),
      documentKey: key,
      content
    } satisfies Prisma.DocumentContentCreateManyInput
  })

  console.log('Create document content for all documents')
  start = performance.now()

  await prismaClient.documentContent.createMany({
    data: contentData
  })
  end = performance.now()
  console.log(`creation document content ${(end - start) / 1000}s`)

  return
}

async function readFile(filepath: string) {
  const data = await fs.readFile(filepath)
  return data
}

main().then(() => console.log('Done'))
