import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { booleanPointInPolygon, point } from '@turf/turf'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { fetchDataEducationSchools } from '~/server/lib/data-education'
import type { JobResult } from '~/server/schema'
import { dataEducationSchoolServerSchema } from '~/server/schema'
import { DataEducationSchoolRepo } from '~/server/database/repository'
import { prismaClient } from '~/server/prisma'

const PAGE_SIZE = 100
const SCHOOL_TYPES = ['Ecole', 'Collège', 'EREA', 'Lycée']
const ACADEMIES = [
  'Aix-Marseille',
  'Amiens',
  'Besançon',
  'Bordeaux',
  'Clermont-Ferrand',
  'Corse',
  'Créteil',
  'Dijon',
  'Grenoble',
  'Guadeloupe',
  'Guyane',
  'La Réunion',
  'Lille',
  'Limoges',
  'Lyon',
  'Martinique',
  'Mayotte',
  'Montpellier',
  'Nancy-Metz',
  'Nantes',
  'Nice',
  'Normandie',
  'Nouvelle Calédonie',
  'Orléans-Tours',
  'Paris',
  'Poitiers',
  'Polynésie Française',
  'Reims',
  'Rennes',
  'Saint Pierre et Miquelon',
  'Strasbourg',
  'Toulouse',
  'Versailles',
  'Wallis et Futuna'
]

interface QpvFeatureProperties {
  id: string
  nom: string
}

type QpvFeature = Feature<Polygon | MultiPolygon, QpvFeatureProperties>

function loadQpvFeatures(): QpvFeature[] {
  const filePath = resolve(process.cwd(), 'public/data/qpv-2024.geojson')
  const geojson = JSON.parse(
    readFileSync(filePath, 'utf-8')
  ) as FeatureCollection<Polygon | MultiPolygon, QpvFeatureProperties>
  return geojson.features
}

function findQpv(
  lat: number,
  lon: number,
  qpvFeatures: QpvFeature[]
): QpvFeatureProperties | null {
  const pt = point([lon, lat])
  for (const feature of qpvFeatures) {
    if (booleanPointInPolygon(pt, feature)) {
      return feature.properties
    }
  }
  return null
}

async function importSchools(job: JobResult) {
  const apiKey = process.env.NUXT_DATA_EDUCATION_API_KEY || undefined
  const now = new Date()

  job.result.nImported = 0

  console.log('school-import: loading QPV geojson...')
  const qpvFeatures = loadQpvFeatures()
  console.log(`school-import: ${qpvFeatures.length} QPV polygons loaded`)

  const typeRefines = SCHOOL_TYPES.map(t => `type_etablissement:${t}`)

  for (const academy of ACADEMIES) {
    const refines = [...typeRefines, `libelle_academie:${academy}`]
    const { total_count } = await fetchDataEducationSchools(
      apiKey,
      1,
      0,
      refines
    )
    job.result.nTotal = (job.result.nTotal ?? 0) + total_count
    console.log(`school-import: [${academy}] ${total_count} schools to process`)

    job.status = 'Ongoing'

    let academyImported = 0
    for (let offset = 0; offset < total_count; offset += PAGE_SIZE) {
      try {
        const { results } = await fetchDataEducationSchools(
          apiKey,
          PAGE_SIZE,
          offset,
          refines
        )

        await Promise.all(
          results.map(async item => {
            const validated = dataEducationSchoolServerSchema.safeParse(item)

            if (!validated.success) {
              const uai =
                (item as Record<string, unknown>)
                  ?.identifiant_de_l_etablissement ?? 'unknown'
              job.errors.push({
                category: 'school-import-format',
                status: null,
                error: `school ${uai}: ${validated.error.toString()}`
              })
              return
            }

            const school = validated.data
            let qpvCode = school.qpvCode
            let qpvName = school.qpvName

            if (school.latitude != null && school.longitude != null) {
              const qpv = findQpv(
                school.latitude,
                school.longitude,
                qpvFeatures
              )
              if (qpv) {
                qpvCode = qpv.id
                qpvName = qpv.nom
              }
            }

            const data = {
              ...school,
              qpvCode,
              qpvName,
              lastImportedAt: now
            }

            try {
              await DataEducationSchoolRepo.prisma.upsert({
                where: { uai: data.uai },
                create: data,
                update: data
              })
              job.result.nImported!++
              academyImported++
            } catch (err) {
              job.errors.push({
                category: 'school-import-upsert',
                status: null,
                error: `upsert ${data.uai}: ${err}`
              })
            }
          })
        )
      } catch (err) {
        job.errors.push({
          category: 'school-import-fetch',
          status: null,
          error: `[${academy}] offset ${offset}: ${err}`
        })
        break
      }
    }
    console.log(
      `school-import: [${academy}] done — ${academyImported} imported`
    )
  }

  const count = await prismaClient.dataEducationSchool.count()
  job.result.nInDatabase = count

  return job
}

export async function handleSchoolsImport() {
  const job: JobResult = {
    id: randomUUID(),
    name: 'data-education-school-import',
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
    await importSchools(job)
  } catch (err: unknown) {
    job.errors.push({
      category: 'school-import-other',
      status: null,
      error: `${err}`
    })
  }

  job.endDate = new Date()
  job.durationInSeconds =
    (job.endDate.getTime() - job.startDate.getTime()) / 1000
  job.status = job.errors.length > 0 ? 'Failure' : 'Success'

  console.log(`school-import: completed with status: ${job.status}`)
  console.log('school-import: result and errors (truncated to 200 first items)')
  console.log(
    JSON.stringify({ ...job, errors: job.errors.slice(0, 200) }, undefined, 2)
  )

  return job
}
