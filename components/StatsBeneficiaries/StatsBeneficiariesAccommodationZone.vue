<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des zones d'hébergement n'ont pas pu être chargées."
    />
    <template v-else-if="accommodationZoneStats">
      <h2 class="fr-h5">Zones d'hébergement</h2>
      <StatsList
        v-if="accommodationZoneStats.length"
        :total-count="beneficiaryCount"
        :stats="accommodationZoneStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="RoutePath.AppBeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des zones
        d'hébergement.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryAccommodationZone } from '@prisma/client'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel } from '~/client/options/stat'
  import { beneficiaryAccommodationZoneLabels } from '~/client/options/beneficiary'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: accommodationZoneCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      accommodationZone: BeneficiaryAccommodationZone | null
      _count: number
    }>
  >(() => useTrpcClient().stat.getAccommodationZoneStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const accommodationZoneStats = computed(
    () =>
      accommodationZoneCounts.value?.map(({ _count, accommodationZone }) => ({
        key: accommodationZone || 'null',
        label: getStatLabel(
          beneficiaryAccommodationZoneLabels,
          accommodationZone
        ),
        count: _count
      })) || []
  )
</script>
