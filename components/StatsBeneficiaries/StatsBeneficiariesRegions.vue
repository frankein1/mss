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
          :to="RoutePath.BeneficiariesAdd()"
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
  import { RoutePath } from '~/utils/routing'
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
  } = await trpcClient.stat.getRegionStats.useQuery(props.filters, {
    default: () => [],
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

  const regionsStats = computed(
    () =>
      regionsCounts.value?.map(({ _count, region }) => ({
        key: region || 'null',
        label: region || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
