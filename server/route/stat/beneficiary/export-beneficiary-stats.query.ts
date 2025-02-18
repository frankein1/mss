import { StructureType } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiarySocioProfessionalCategoryKeys,
  familySituationKeys,
  ageGroupKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys
} from '~/client/options'
import {
  getBeneficiaryCountQuery,
  getGenderStatsQuery,
  getAgeStatsQuery,
  getFamilyStatsQuery,
  getCityStatsQuery,
  getRegionStatsQuery,
  getAccommodationZoneStatsQuery,
  getAccommodationModeStatsQuery,
  getMobilityStatsQuery,
  getCSPStatsQuery,
  getMinistereStructureStatsQuery,
  getMinistereDepartementServiceAcStatsQuery,
  getMinistereCategorieStatsQuery,
  getDepartmentStatsQuery,
  getMinistereInterpellationStatsQuery
} from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { getPercentage } from '~/utils/stats'
import { getColumns } from '~/utils/export/getColumns'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.stats

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const exportData = []

  const beneficiaryCount = await getBeneficiaryCountQuery(user, input)

  // Gender
  const genders = await getGenderStatsQuery(user, input)
  const genderColumns = getColumns('Genre')
  const genderRows = genders.map(({ gender, _count }) => ({
    label: beneficiaryGenderKeys.value(gender) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({ name: 'Genre', columns: genderColumns, rows: genderRows })

  // Age
  const ages = await getAgeStatsQuery(user, input)
  const ageColumns = getColumns("Tranches d'âge")
  const ageRows = ages.map(({ ageGroup, _count }) => ({
    label: ageGroupKeys.value(ageGroup) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  // Family situation
  const situations = await getFamilyStatsQuery(user, input)
  const familyColumns = getColumns('Types de situations familiales')
  const familyRows = situations.map(({ familySituation, _count }) => ({
    label: familySituationKeys.value(familySituation) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: 'Types de situations familiales',
    columns: familyColumns,
    rows: familyRows
  })

  // Cities
  const cities = await getCityStatsQuery(user, input)
  const cityColumns = getColumns('Villes')
  const cityRows = cities.map(({ city, _count }) => ({
    label: city || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: 'Villes',
    columns: cityColumns,
    rows: cityRows
  })

  // Departments
  const departments = await getDepartmentStatsQuery(user, input)
  const departmentColumns = getColumns('Départements')
  const departmentRows = departments.map(({ department, _count }) => ({
    label: department || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: 'Départements',
    columns: departmentColumns,
    rows: departmentRows
  })

  // Regions
  const regions = await getRegionStatsQuery(user, input)
  const regionColumns = getColumns('Régions')
  const regionRows = regions.map(({ region, _count }) => ({
    label: region || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({ name: 'Régions', columns: regionColumns, rows: regionRows })

  if (structure.type === StructureType.Ministere) {
    // Accommodation zone
    const zones = await getAccommodationZoneStatsQuery(user, input)
    const accommodationZoneColumns = getColumns("Zones d'hébergement")
    const accommodationZoneRows = zones.map(
      ({ accommodationZone, _count }) => ({
        label:
          beneficiaryAccommodationZoneKeys.value(accommodationZone) ||
          STATS_NULL_LABEL,
        number: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount.count)}%`
      })
    )
    exportData.push({
      name: "Zones d'hébergement",
      columns: accommodationZoneColumns,
      rows: accommodationZoneRows
    })
  }

  // Accomodation mode
  const modes = await getAccommodationModeStatsQuery(user, input)
  const accommodationModeColumns = getColumns("Modes d'hébergement")
  const accommodationModeRows = modes.map(({ accommodationMode, _count }) => ({
    label:
      beneficiaryAccommodationModeKeys.value(accommodationMode) ||
      STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: "Modes d'hébergement",
    columns: accommodationModeColumns,
    rows: accommodationModeRows
  })

  // Mobility data
  const mobilities = await getMobilityStatsQuery(user, input)
  const mobilityColumns = getColumns('Données mobilité')
  const mobilityRows = mobilities.map(({ mobility, _count }) => ({
    label: beneficiaryMobilityKeys.value(mobility) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({
    name: 'Données mobilité',
    columns: mobilityColumns,
    rows: mobilityRows
  })

  // CSP
  const csps = await getCSPStatsQuery(user, input)
  const CSPColumns = getColumns('Catégories socio-professionnelles')
  const CSPRows = csps.map(({ socioProfessionalCategory, _count }) => ({
    label:
      beneficiarySocioProfessionalCategoryKeys.value(
        socioProfessionalCategory
      ) || STATS_NULL_LABEL,
    number: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount.count)}%`
  }))
  exportData.push({ name: 'CSP', columns: CSPColumns, rows: CSPRows })

  if (structure.type === StructureType.Ministere) {
    // Ministere structure
    const structures = await getMinistereStructureStatsQuery(user, input)
    const ministereStructureColumns = getColumns('Structures de rattachement')
    const ministereStructureRows = structures.map(
      ({ ministereStructure, _count }) => ({
        label:
          ministereStructureKeys.value(ministereStructure) || STATS_NULL_LABEL,
        number: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount.count)}%`
      })
    )
    exportData.push({
      name: 'Structures de rattachement',
      columns: ministereStructureColumns,
      rows: ministereStructureRows
    })

    // Ministere departement service
    const services = await getMinistereDepartementServiceAcStatsQuery(
      user,
      input
    )
    const ministereDepartementColumns = getColumns(
      "Départements ou services de l'administration centrale"
    )
    const ministereDepartementRows = services.map(
      ({ ministereDepartementServiceAc, _count }) => ({
        label:
          ministereDepartmentServiceAcKeys.value(
            ministereDepartementServiceAc
          ) || STATS_NULL_LABEL,
        number: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount.count)}%`
      })
    )
    exportData.push({
      name: "Départements de l'AC",
      columns: ministereDepartementColumns,
      rows: ministereDepartementRows
    })

    // Ministere category
    const categories = await getMinistereCategorieStatsQuery(user, input)
    const ministereCategorieColumns = getColumns('Catégories')
    const ministereCategorieRows = categories.map(
      ({ ministereCategorie, _count }) => ({
        label:
          ministereCategorieKeys.value(ministereCategorie) || STATS_NULL_LABEL,
        number: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount.count)}%`
      })
    )
    exportData.push({
      name: 'Catégories',
      columns: ministereCategorieColumns,
      rows: ministereCategorieRows
    })

    // Minister interpellations
    const interpellations = await getMinistereInterpellationStatsQuery(
      user,
      input
    )
    const totalCount = interpellations.reduce((acc, cur) => acc + cur._count, 0)
    const ministerInterpellationColumns = getColumns('Ministre')
    const ministerInterpellationRows = interpellations.map(
      ({ ministre, _count }) => ({
        label: ministre || STATS_NULL_LABEL,
        number: _count.toString(),
        percent: `${getPercentage(_count, totalCount)}%`
      })
    )

    exportData.push({
      name: 'Interpellations de ministre',
      columns: ministerInterpellationColumns,
      rows: ministerInterpellationRows
    })
  }

  const stream = await createExport(user.id, exportData)

  return { data: stream.toString('base64') }
}

export const exportBeneficiaryStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
