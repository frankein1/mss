import { randomUUID } from 'node:crypto'
import type { JobResult } from '~/server/schema'
import { dataInclusionStructureServerSchemaV1 } from '~/server/schema'
import { fetchStructuresPages } from '~/server/lib/data-inclusion'
import { prismaClient } from '~/server/prisma'

async function importStructures(job: JobResult) {
  // This will be merged with scheduler env when the code will be migrated
  const apiUrl = process.env.NUXT_DATA_INCLUSION_API_URL || ''
  const apiToken = process.env.NUXT_DATA_INCLUSION_API_TOKEN || ''

  if (!apiUrl || !apiToken) {
    job.errors.push({
      category: 'structure-import-download',
      status: null,
      error:
        'Missing DATA_INCLUSION_API_URL or DATA_INCLUSION_API_TOKEN environment variable'
    })
    return job
  }

  job.result.nImported = 0

  let currentPage = 1
  let totalPages = 1

  while (currentPage <= totalPages) {
    const page = await fetchStructuresPages(apiUrl, apiToken, currentPage)
    totalPages = page.pages
    currentPage++

    job.status = 'Ongoing'
    job.result.nTotal = page.total

    for (const item of page.items) {
      const validated = dataInclusionStructureServerSchemaV1.safeParse(item)

      if (validated.success === false) {
        const inputId = (item as any)?.id ?? 'unknown'
        job.errors.push({
          category: 'structure-import-format',
          status: null,
          error: `structure ${inputId}: ${validated.error.toString()}`
        })
        continue
      }

      const structure = validated.data

      // All structures are updated.
      try {
        await prismaClient.dataInclusionStructureV1.upsert({
          where: { id: structure.id },
          create: structure,
          update: structure
        })
        job.result.nImported++
      } catch (err: unknown) {
        job.errors.push({
          category: 'structure-import-update',
          status: null,
          error: `in update all - upsert ${structure.id}: ${err}`
        })
      }
    }

    console.log(
      'nImported',
      new Date().toISOString(),
      job.result.nImported,
      'nErrors',
      job.errors.length
    )
  }

  const count = await prismaClient.dataInclusionStructureV1.count()
  job.result.nInDatabase = count

  return job
}

export async function handleStructuresImport() {
  const job: JobResult = {
    id: randomUUID(),
    name: `data-inclusion-structure-import-cron-all`,
    status: 'Created',
    startDate: new Date(),
    endDate: null,
    durationInSeconds: null,
    errors: [],
    result: {
      nTotal: 0,
      nInDatabase: 0,
      nImported: 0,
      nCreated: 0,
      nUpdated: 0
    }
  }

  try {
    await DataInclusionIntegrationService.importStructures(job)
  } catch (err: unknown) {
    job.errors.push({
      category: 'structure-import-other',
      status: null,
      error: `${err}`
    })
  }

  job.endDate = new Date()
  job.durationInSeconds =
    (job.endDate.getTime() - job.startDate.getTime()) / 1000
  job.status = job.errors.length > 0 ? 'Failure' : 'Success'

  console.log(
    `data-inclusion-structure-import: import completed with status: ${job.status}`
  )
  console.log(
    'data-inclusion-structure-import: result and errors (truncated to 200 first items)'
  )
  console.log(
    JSON.stringify({ ...job, errors: job.errors.slice(0, 200) }, undefined, 2)
  )

  return job
}

export const DataInclusionIntegrationService = {
  importStructures
}

// FIXME: this will be deleted when the endpoint in admin panel is deleted
export const DataInclusionIntegrationHandler = {
  handleStructuresImport
}
