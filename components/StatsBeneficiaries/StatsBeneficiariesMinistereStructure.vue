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
      <h4 class="fr-h5">Structures de rattachement</h4>
      <StatsList
        v-if="ministereStructureStats.length"
        :total-count="beneficiaryCount"
        :stats="ministereStructureStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des structures
        de rattachement.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministereStructureKeys } from '~/client/options'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereStructureCounts,
    pending,
    error
  } = await useTrpcClient().stat.getMinistereStructure.useQuery(props.filters)

  const ministereStructureStats = computed(
    () =>
      ministereStructureCounts.value?.map(({ _count, ministereStructure }) => ({
        key: ministereStructure || 'null',
        label: getStatLabel(ministereStructureKeys.byKey, ministereStructure),
        count: _count
      })) || []
  )
</script>
