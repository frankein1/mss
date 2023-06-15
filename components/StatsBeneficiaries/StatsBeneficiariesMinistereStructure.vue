<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des structures de rattachement n'ont pas pu être chargées."
    />
    <template v-else-if="ministereStructureStats">
      <h2 class="fr-h5">Structures de rattachement</h2>
      <StatsList
        v-if="ministereStructureStats.length"
        :total-count="beneficiaryCount"
        :stats="ministereStructureStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="RoutePath.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des structures
        de rattachement.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryMinistereStructure } from '@prisma/client'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel } from '~/client/options/stat'
  import { ministereStructureLabels } from '~/client/options/ministry'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereStructureCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      ministereStructure: BeneficiaryMinistereStructure | null
      _count: number
    }>
  >(() => useTrpcClient().stat.getMinistereStructure.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const ministereStructureStats = computed(
    () =>
      ministereStructureCounts.value?.map(({ _count, ministereStructure }) => ({
        key: ministereStructure || 'null',
        label: getStatLabel(ministereStructureLabels, ministereStructure),
        count: _count
      })) || []
  )
</script>
