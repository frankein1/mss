import { expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { TextWriter, ZipReader, BlobReader } from '@zip.js/zip.js'
import { readFileSync } from 'fs'
import { formatDate } from '~/utils/formatDate'
import { createFamilyFile } from '~~/test/server/fixtures/familyFiles'
import { createBeneficiary } from '~~/test/server/fixtures/beneficiaries'

let familyFileId: string
let beneficiaryId: string

beforeEach(async () => {
  const date = new Date('2020-11-25')
  const file = await createFamilyFile(date)
  familyFileId = file.id
  const ben = await createBeneficiary(date, familyFileId)

  beneficiaryId = ben.id
})

afterEach(async () => await resetDatabase(familyFileId, beneficiaryId))

test('Beneficiary - Archive - Structure Manager should be able to export complete beneficiary data', async ({
  trpc
}) => {
  const { archiveFile } =
    await trpc.structureManager.beneficiary.exportBeneficiary({
      beneficiaryId,
      keepName: true
    })

  const filecontents = await readZippedArchive(archiveFile)
  const dir = './test/server/references/beneficiary-export/'

  const summary = readFileSync(`${dir}Résumé_archive.html`)
    .toString()
    .replace('XX/XX/XXXX', formatDate(new Date()))

  expect(filecontents['Résumé_archive.html']).toBe(summary)

  const beneficiaryInfo = readFileSync(
    `${dir}Informations/Louise Attaque.html`
  ).toString()

  expect(filecontents['Informations/Louise Attaque.html']).toBe(beneficiaryInfo)
})

/** Unzip archive and set file contents in an object indexed by their file name */
async function readZippedArchive(dataurl: string) {
  const res = await fetch(dataurl)
  const reader = new BlobReader(await res.blob())
  const zipReader = new ZipReader(reader)
  const entries = await zipReader.getEntries()

  const filecontents: Record<string, string> = {}
  for (const entry of entries) {
    if (entry.directory) {
      continue
    }
    if (!entry.getData) {
      continue
    }
    const writer = new TextWriter()
    const content = await entry.getData(writer)
    filecontents[entry.filename] = content
  }

  return filecontents
}

const _convertHtmlToText = (html: string) =>
  html.replace(/<style.*?<\/style>/gs, '').replace(/<[^>]*>/g, '')

async function resetDatabase(fid: string, bid: string) {
  if (bid) {
    await prismaClient.beneficiary.delete({ where: { id: bid } })
  }
  if (fid) {
    await prismaClient.familyFile.delete({ where: { id: fid } })
  }
}
