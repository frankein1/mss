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
        <NuxtLink :to="RoutePath.AppBeneficiariesAdd()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des tranches
        d'âge.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AgeGroup, ageGroupLabels } from '~/client/options/ageGroup'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { getStatColor } from '~/client/colors/stats'
  import { getStatLabel } from '~/client/options/stat'
  import { StatsPiePropType } from '~/types/stat'

  const AgeGroupColors = {
    [AgeGroup.Less25]: '#BABAFF',
    [AgeGroup.Group25_34]: '#A8A8FF',
    [AgeGroup.Group35_44]: '#8585f6',
    [AgeGroup.Group45_54]: '#6a6af4',
    [AgeGroup.Group55_64]: '#313178',
    [AgeGroup.More65]: '#272747'
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
  } = await trpcClient.stat.getAgeStats.useQuery(props.filters)

  const ageStats = computed(
    () =>
      (ageCounts.value?.map(({ _count, ageGroup }) => ({
        key: ageGroup,
        label: getStatLabel(ageGroupLabels, ageGroup),
        color: getStatColor(AgeGroupColors, ageGroup),
        count: _count
      })) || []) as StatsPiePropType
  )
</script>
