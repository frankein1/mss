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
      <h4 class="fr-h5">Zones d'hébergement</h4>
      <StatsList
        v-if="accommodationZoneStats.length"
        :total-count="beneficiaryCount"
        :stats="accommodationZoneStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des zones
        d'hébergement.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { StatFilterInput } from '~/server/schema'
  import {
    getStatLabel,
    beneficiaryAccommodationZoneKeys
  } from '~/client/options'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: accommodationZoneCounts,
    pending,
    error
  } = await useTrpcClient().stat.getAccommodationZoneStats.useQuery(
    props.filters
  )

  const accommodationZoneStats = computed(
    () =>
      accommodationZoneCounts.value?.map(({ _count, accommodationZone }) => ({
        key: accommodationZone || 'null',
        label: getStatLabel(
          beneficiaryAccommodationZoneKeys.byKey,
          accommodationZone
        ),
        count: _count
      })) || []
  )
</script>
