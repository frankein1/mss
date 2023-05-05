<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des régions n'ont pas pu être chargées."
    />
    <template v-else-if="regionsStats">
      <h2 class="fr-h5">Régions</h2>
      <StatsList
        v-if="regionsStats.length"
        :total-count="beneficiaryCount"
        :stats="regionsStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des régions.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { STATS_NULL_LABEL } from '~/client/options/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: regionsCounts,
    pending,
    error
  } = useAsyncData<Array<{ region: string | null; _count: number }>>(
    () => trpcClient.stat.getRegionStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const regionsStats = computed(
    () =>
      regionsCounts.value?.map(({ _count, region }) => ({
        key: region,
        label: region || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
