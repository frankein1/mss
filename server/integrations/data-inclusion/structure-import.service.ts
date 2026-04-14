import type { JobResult } from '~/server/schema'
import { dataInclusionStructureServerSchemaV1 } from '~/server/schema'
import { fetchStructuresPages } from '~/server/lib/data-inclusion'
import { JobResultService } from '~/server/services'
import { prismaClient } from '~/server/prisma'

export async function getStructureStatusInDB(id: string, updateDate: Date) {
  const structure = await prismaClient.dataInclusionStructureV1.findFirst({
    select: { updated: true },
    where: { id }
  })

  const exists = structure !== null
  const shouldBeUpdated =
    exists &&
    structure.updated &&
    structure.updated.getTime() < updateDate.getTime()

  return { exists, shouldBeUpdated }
}

async function importStructures(job: JobResult, all = false) {
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

  job.result.nCreated = 0
  job.result.nUpdated = 0
  job.result.nImported = 0

  let currentPage = 1
  let totalPages = 1

  while (currentPage <= totalPages) {
    const page = await fetchStructuresPages(apiUrl, apiToken, currentPage)
    totalPages = page.pages
    currentPage++

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

      if (all) {
        // Update all structures. Useful when a field is added of the import algo has changed
        try {
          await prismaClient.dataInclusionStructureV1.upsert({
            where: { id: structure.id },
            create: structure,
            update: structure
          })
          job.result.nUpdated++
          job.result.nImported++
        } catch (err: unknown) {
          job.errors.push({
            category: 'structure-import-update',
            status: null,
            error: `in update all - upsert ${structure.id}: ${err}`
          })
        }
        continue
      } else {
        // Only update structures that have been updated since the latest import
        let exists: boolean
        let shouldBeUpdated: boolean

        try {
          const status = await getStructureStatusInDB(
            structure.id,
            structure.updated
          )
          exists = status.exists
          shouldBeUpdated = status.shouldBeUpdated || false
        } catch (err: unknown) {
          job.errors.push({
            category: 'structure-import-other',
            status: null,
            error: `could not check update status for id ${structure.id}, name ${structure.name}: ${err}`
          })
          continue
        }

        if (!exists) {
          try {
            await prismaClient.dataInclusionStructureV1.create({
              data: structure
            })
            job.result.nCreated++
            job.result.nImported++
          } catch (err: unknown) {
            job.errors.push({
              category: 'structure-import-create',
              status: null,
              error: `in create ${structure.id}: ${err}`
            })
          }
          continue
        } else if (shouldBeUpdated) {
          try {
            await prismaClient.dataInclusionStructureV1.update({
              where: { id: structure.id },
              data: structure
            })
            job.result.nUpdated++
            job.result.nImported++
          } catch (err: unknown) {
            job.errors.push({
              category: 'structure-import-update',
              status: null,
              error: `in update ${structure.id}: ${err}`
            })
          }
          continue
        }
      }
    }

    console.log(
      'nImported',
      new Date().toISOString(),
      job.result.nImported,
      'nErrors',
      job.errors.length
    )

    // Update status
    job.status = 'Ongoing'
    await JobResultService.update({
      id: job.id,
      status: job.status,
      errors: job.errors,
      result: job.result
    })
  }

  const count = await prismaClient.dataInclusionStructureV1.count()
  job.result.nInDatabase = count

  return job
}

export async function handleStructuresImport(all = false) {
  const job = await JobResultService.create({
    name: `data-inclusion-structure-import-cron${all ? '-all' : ''}`,
    errors: [],
    result: {
      nTotal: 0,
      nInDatabase: 0,
      nImported: 0,
      nCreated: 0,
      nUpdated: 0
    }
  })

  try {
    await DataInclusionIntegrationService.importStructures(job, all)
  } catch (err: unknown) {
    job.errors.push({
      category: 'structure-import-other',
      status: null,
      error: `${err}`
    })
  }

  const endDate = new Date()
  const durationInSeconds = (endDate.getTime() - job.startDate.getTime()) / 1000
  console.log('duration in seconds', durationInSeconds)

  job.endDate = endDate
  job.durationInSeconds = durationInSeconds
  job.status = job.errors.length > 0 ? 'Failure' : 'Success'

  return await JobResultService.update({
    id: job.id,
    status: job.status,
    endDate: job.endDate,
    durationInSeconds: job.durationInSeconds,
    errors: job.errors,
    result: job.result
  })
}

export const DataInclusionIntegrationService = {
  importStructures
}

export const DataInclusionIntegrationHandler = {
  handleStructuresImport
}
