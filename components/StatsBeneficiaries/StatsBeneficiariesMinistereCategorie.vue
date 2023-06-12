<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des catégories n'ont pas pu être chargées."
    />
    <template v-else-if="ministereCategorieStats">
      <h2 class="fr-h5">Catégories</h2>
      <StatsList
        v-if="ministereCategorieStats.length"
        :total-count="beneficiaryCount"
        :stats="ministereCategorieStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="RoutePath.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des catégories.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryMinistereCategorie } from '@prisma/client'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel } from '~/client/options/stat'
  import { ministereCategorieLabels } from '~/client/options/ministry'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereCategorieCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      ministereCategorie: BeneficiaryMinistereCategorie | null
      _count: number
    }>
  >(() => useTrpcClient().stat.getMinistereCategorie.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const ministereCategorieStats = computed(
    () =>
      ministereCategorieCounts.value?.map(({ _count, ministereCategorie }) => ({
        key: ministereCategorie || 'null',
        label: getStatLabel(ministereCategorieLabels, ministereCategorie),
        count: _count
      })) || []
  )
</script>
