<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des modes d'hébergement n'ont pas pu être chargées."
    />
    <template v-else-if="accommodationModesStats">
      <h2 class="fr-h5">Modes d'hébergement</h2>
      <StatsList
        v-if="accommodationModesStats.length"
        :total-count="beneficiaryCount"
        :stats="accommodationModesStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd()"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des modes
        d'hébergement.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryAccommodationMode } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { getStatLabel } from '~/client/options/stat'
  import { beneficiaryAccommodationModeLabels } from '~/client/options/beneficiary'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: accommodationModesCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      accommodationMode: BeneficiaryAccommodationMode | null
      _count: number
    }>
  >(() => trpcClient.stat.getAccommodationModeStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const accommodationModesStats = computed(
    () =>
      accommodationModesCounts.value?.map(({ _count, accommodationMode }) => ({
        key: accommodationMode || 'null',
        label: getStatLabel(
          beneficiaryAccommodationModeLabels,
          accommodationMode
        ),
        count: _count
      })) || []
  )
</script>
