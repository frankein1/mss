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
  const genderColumns = [
    { key: 'label', header: 'Genre' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const genderRows = genders.map(({ gender, _count }) => ({
    label: beneficiaryGenderKeys.value(gender) || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({ name: 'Genre', columns: genderColumns, rows: genderRows })

  // Age
  const ages = await getAgeStatsQuery(user, input)
  const ageColumns = [
    { key: 'label', header: "Tranches d'âge" },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const ageRows = ages.map(({ ageGroup, _count }) => ({
    label: ageGroupKeys.value(ageGroup) || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: "Tranches d'âge",
    columns: ageColumns,
    rows: ageRows
  })

  // Family situation
  const situations = await getFamilyStatsQuery(user, input)
  const familyColumns = [
    { key: 'label', header: 'Types de situations familiales' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const familyRows = situations.map(({ familySituation, _count }) => ({
    label: familySituationKeys.value(familySituation) || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: 'Types de situations familiales',
    columns: familyColumns,
    rows: familyRows
  })

  // Cities
  const cities = await getCityStatsQuery(user, input)
  const cityColumns = [
    { key: 'label', header: 'Villes' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const cityRows = cities.map(({ city, _count }) => ({
    label: city || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: 'Villes',
    columns: cityColumns,
    rows: cityRows
  })

  // Departments
  const departments = await getDepartmentStatsQuery(user, input)
  const departmentColumns = [
    { key: 'label', header: 'Départements' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const departmentRows = departments.map(({ department, _count }) => ({
    label: department || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: 'Départements',
    columns: departmentColumns,
    rows: departmentRows
  })

  // Regions
  const regions = await getRegionStatsQuery(user, input)
  const regionColumns = [
    { key: 'label', header: 'Régions' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const regionRows = regions.map(({ region, _count }) => ({
    label: region || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({ name: 'Régions', columns: regionColumns, rows: regionRows })

  if (structure.type === StructureType.Ministere) {
    // Accommodation zone
    const zones = await getAccommodationZoneStatsQuery(user, input)
    const accommodationZoneColumns = [
      { key: 'label', header: "Zones d'hébergement" },
      { key: '_count', header: 'Nombre' },
      { key: 'percent', header: 'Pourcentage' }
    ]
    const accommodationZoneRows = zones.map(
      ({ accommodationZone, _count }) => ({
        label:
          beneficiaryAccommodationZoneKeys.value(accommodationZone) ||
          STATS_NULL_LABEL,
        _count: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount)}%`
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
  const accommodationModeColumns = [
    { key: 'label', header: "Modes d'hébergement" },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const accommodationModeRows = modes.map(({ accommodationMode, _count }) => ({
    label:
      beneficiaryAccommodationModeKeys.value(accommodationMode) ||
      STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: "Modes d'hébergement",
    columns: accommodationModeColumns,
    rows: accommodationModeRows
  })

  // Mobility data
  const mobilities = await getMobilityStatsQuery(user, input)
  const mobilityColumns = [
    { key: 'label', header: 'Données mobilité' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const mobilityRows = mobilities.map(({ mobility, _count }) => ({
    label: beneficiaryMobilityKeys.value(mobility) || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({
    name: 'Données mobilité',
    columns: mobilityColumns,
    rows: mobilityRows
  })

  // CSP
  const csps = await getCSPStatsQuery(user, input)
  const CSPColumns = [
    { key: 'label', header: 'Catégories socio-professionnelles' },
    { key: '_count', header: 'Nombre' },
    { key: 'percent', header: 'Pourcentage' }
  ]
  const CSPRows = csps.map(({ socioProfessionalCategory, _count }) => ({
    label:
      beneficiarySocioProfessionalCategoryKeys.value(
        socioProfessionalCategory
      ) || STATS_NULL_LABEL,
    _count: _count.toString(),
    percent: `${getPercentage(_count, beneficiaryCount)}%`
  }))
  exportData.push({ name: 'CSP', columns: CSPColumns, rows: CSPRows })

  if (structure.type === StructureType.Ministere) {
    // Ministere structure
    const structures = await getMinistereStructureStatsQuery(user, input)
    const ministereStructureColumns = [
      { key: 'label', header: 'Structures de rattachement' },
      { key: '_count', header: 'Nombre' },
      { key: 'percent', header: 'Pourcentage' }
    ]
    const ministereStructureRows = structures.map(
      ({ ministereStructure, _count }) => ({
        label:
          ministereStructureKeys.value(ministereStructure) || STATS_NULL_LABEL,
        _count: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount)}%`
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
    const ministereDepartementColumns = [
      {
        key: 'label',
        header: "Départements ou services de l'administration centrale"
      },
      { key: '_count', header: 'Nombre' },
      { key: 'percent', header: 'Pourcentage' }
    ]
    const ministereDepartementRows = services.map(
      ({ ministereDepartementServiceAc, _count }) => ({
        label:
          ministereDepartmentServiceAcKeys.value(
            ministereDepartementServiceAc
          ) || STATS_NULL_LABEL,
        _count: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount)}%`
      })
    )
    exportData.push({
      name: "Départements de l'AC",
      columns: ministereDepartementColumns,
      rows: ministereDepartementRows
    })

    // Ministere category
    const categories = await getMinistereCategorieStatsQuery(user, input)
    const ministereCategorieColumns = [
      { key: 'label', header: 'Catégories' },
      { key: '_count', header: 'Nombre' },
      { key: 'percent', header: 'Pourcentage' }
    ]
    const ministereCategorieRows = categories.map(
      ({ ministereCategorie, _count }) => ({
        label:
          ministereCategorieKeys.value(ministereCategorie) || STATS_NULL_LABEL,
        _count: _count.toString(),
        percent: `${getPercentage(_count, beneficiaryCount)}%`
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
    const ministerInterpellationColumns = [
      { key: 'label', header: 'Ministre' },
      { key: '_count', header: 'Nombre' },
      { key: 'percent', header: 'Pourcentage' }
    ]
    const ministerInterpellationRows = interpellations.map(
      ({ ministre, _count }) => ({
        label: ministre,
        _count: _count.toString(),
        percent: `${getPercentage(_count, totalCount)}%`
      })
    )

    exportData.push({
      name: 'Interpellations de ministre',
      columns: ministerInterpellationColumns,
      rows: ministerInterpellationRows
    })
  }

  return await createExport(user.id, exportData)
}

export const exportBeneficiaryStatsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
