<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des tranches d'âge n'ont pas pu être chargées."
    />
    <template v-else-if="ageStats">
      <h2 class="fr-h5">Tranches d'âge</h2>
      <StatsPie
        v-if="ageStats.length"
        pie-label="Répartition des tranches d'âge"
        :stats="ageStats"
        :total-count="beneficiaryCount"
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des tranches
        d'âge.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs'
  import { AgeGroupsFilter, NullAgeGroup, AgeGroupOrNull } from './types'
  import { AgeGroup, AgeGroupLabels } from '~/client/options/ageGroup'
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { dateIsBetween, dateIsSameOrBefore, dateIsSameOrAfter } from '~/utils'
  import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { STATS_NULL_COLOR } from '~/client/colors/stats'

  const AgeGroupColors = {
    [AgeGroup.Less25]: '#BABAFF',
    [AgeGroup.Group25_34]: '#A8A8FF',
    [AgeGroup.Group35_44]: '#8585f6',
    [AgeGroup.Group45_54]: '#6a6af4',
    [AgeGroup.Group55_64]: '#313178',
    [AgeGroup.More65]: '#272747',
    [NullAgeGroup.null]: STATS_NULL_COLOR
  }

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ageCounts,
    pending,
    error
  } = useAsyncData<Array<{ birthDate: Date | null; _count: number }>>(
    () => trpcClient.stat.getAgeStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const ageStats = computed(() => {
    const ageGroupsFilters: { [k in AgeGroup]?: AgeGroupsFilter } = {}
    Object.values(AgeGroup).forEach(value => {
      const { lower, upper } = ageGroupToDateRange(value)
      ageGroupsFilters[value] = {
        lower,
        upper
      }
    })
    const ageGroupsCounts: { [k in AgeGroupOrNull]?: number } = {}
    ageCounts.value?.forEach(
      ({ birthDate, _count }: { birthDate: Date | null; _count: number }) => {
        if (birthDate) {
          const convertedBirthDate = dayjs(birthDate)
          ;(
            Object.entries(ageGroupsFilters) as Array<
              [AgeGroup, AgeGroupsFilter]
            >
          ).forEach(([key, value]) => {
            if (value.lower && value.upper) {
              if (dateIsBetween(convertedBirthDate, value.lower, value.upper)) {
                ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
              }
            } else if (value.lower) {
              if (dateIsSameOrAfter(convertedBirthDate, value.lower)) {
                ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
              }
            } else if (value.upper) {
              if (dateIsSameOrBefore(convertedBirthDate, value.upper)) {
                ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
              }
            }
          })
        } else {
          ageGroupsCounts[`${birthDate}`] =
            (ageGroupsCounts[`${birthDate}`] || 0) + _count
        }
      }
    )
    const ageGroupsCountsResults = (
      Object.entries(ageGroupsCounts) as Array<[AgeGroupOrNull, number]>
    ).map(([key, value]) => ({
      key,
      label: AgeGroupLabels[key],
      color: AgeGroupColors[key],
      count: value
    }))
    ageGroupsCountsResults.sort((a, b) => b.count - a.count)
    return ageGroupsCountsResults
  })
</script>
