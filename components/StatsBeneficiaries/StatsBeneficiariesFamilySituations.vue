<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des situations familiales n'ont pas pu être chargées."
    />
    <template v-else-if="familySituationsStats">
      <h2 class="fr-h5">Types de situations familiales</h2>
      <StatsList
        v-if="familySituationsStats.length"
        :total-count="beneficiaryCount"
        :stats="familySituationsStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des situations
        familiales.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryFamilySituation } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { getStatLabel } from '~/client/options/stat'
  import { familySituationLabels } from '~/client/options/familySituation'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: familySituationsCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      familySituation: BeneficiaryFamilySituation | null
      _count: number
    }>
  >(() => trpcClient.stat.getFamilyStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const familySituationsStats = computed(
    () =>
      familySituationsCounts.value?.map(({ _count, familySituation }) => ({
        key: familySituation || 'null',
        label: getStatLabel(familySituationLabels, familySituation),
        count: _count
      })) || []
  )
</script>
