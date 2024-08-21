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
      <h4 class="fr-h5">Modes d'hébergement</h4>
      <StatsList
        v-if="accommodationModesStats.length"
        :total-count="beneficiaryCount"
        :stats="accommodationModesStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des modes
        d'hébergement.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import {
    getStatLabel,
    beneficiaryAccommodationModeKeys
  } from '~/client/options'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: accommodationModesCounts,
    pending,
    error
  } = await trpcClient.stat.getAccommodationModeStats.useQuery(props.filters)

  const accommodationModesStats = computed(
    () =>
      accommodationModesCounts.value?.map(({ _count, accommodationMode }) => ({
        key: accommodationMode || 'null',
        label: getStatLabel(
          beneficiaryAccommodationModeKeys.byKey,
          accommodationMode
        ),
        count: _count
      })) || []
  )
</script>
