import { JobResult } from './types'
import {
  getStructureStatusInDB,
  createStructure,
  updateStructure,
  createJob,
  updateJob
} from './structure-import.query'
import { dataInclusionStructureServerSchema } from '~/server/schema'

const STRUCTURE_DOWNLOAD_URL_JSON =
  'https://www.data.gouv.fr/fr/datasets/r/4fc64287-e869-4550-8fb9-b1e0b7809ffa'

async function downloadStructures() {
  const res = await fetch(STRUCTURE_DOWNLOAD_URL_JSON, {
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const data = await res.json()

    return { data, headers: res.headers, error: null }
  }

  return {
    data: null,
    headers: res.headers,
    error: { status: res.status, msg: res.statusText }
  }
}

async function importStructures(job: JobResult) {
  const res = await downloadStructures()

  if (res.error !== null) {
    job.errors.push({
      category: 'structure-import-download',
      status: res.error.status,
      error: res.error.msg
    })

    return job
  }

  if (Array.isArray(res.data)) {
    job.result.nToImport = res.data.length
  } else {
    job.errors.push({
      category: 'structure-import-download',
      status: null,
      error: `Data inclusion structure data is badly formatted: should be an array`
    })

    return job
  }

  for (const input of res.data) {
    const validated = dataInclusionStructureServerSchema.safeParse(input)

    if (validated.success === false) {
      job.errors.push({
        category: 'structure-import-format',
        status: null,
        error: `Format error for input: ${validated.error}`
      })

      continue
    }

    const structure = validated.data

    const { exists, shouldBeUpdated } = await getStructureStatusInDB(
      structure.id,
      structure.updated
    )

    const version = res.headers.get('location') || 'unknown'

    if (!exists) {
      try {
        await createStructure(structure, version)
        job.result.nCreated++
        job.result.nImported++
      } catch (err: unknown) {
        job.errors.push({
          category: 'structure-import-create',
          status: null,
          error: `in create ${structure.id}: ${err}`
        })
      }
    } else if (shouldBeUpdated) {
      try {
        await updateStructure(structure, version)
        job.result.nUpdated++
        job.result.nImported++
      } catch (err: unknown) {
        job.errors.push({
          category: 'structure-import-update',
          status: null,
          error: `in update ${structure.id}: ${err}`
        })
      }
    }
  }

  return job
}

async function handleStructuresImport(iscron = false) {
  const job = await createJob({
    name: iscron
      ? 'data-inclusion-structure-import-cron'
      : 'data-inclusion-structure-import',
    errors: [],
    result: {
      nToImport: 0,
      nImported: 0,
      nCreated: 0,
      nUpdated: 0
    }
  })

  try {
    await DataInclusionService.importStructures(job)
  } catch (err: unknown) {
    job.errors.push({
      category: 'structure-import-other',
      status: null,
      error: `${err}`
    })
  }

  const endDate = new Date()
  const durationInSeconds = (endDate.getTime() - job.startDate.getTime()) / 1000

  job.endDate = endDate
  job.durationInSeconds = durationInSeconds
  job.status = job.errors.length > 0 ? 'Failure' : 'Success'

  console.info(JSON.stringify(job, undefined, 2))
  await updateJob({
    id: job.id,
    status: job.status,
    endDate: job.endDate,
    durationInSeconds: job.durationInSeconds,
    errors: job.errors,
    result: job.result
  })
}

export const DataInclusionService = {
  importStructures
}

export const DataInclusionHandler = {
  handleStructuresImport
}
