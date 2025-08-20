<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des zones d'hébergement n'ont pas pu être chargées."
  />

  <StatsList
    v-if="accommodationZoneStats"
    :total-count="beneficiaryCount"
    :stats="accommodationZoneStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryAccommodationZone
      })
    "
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

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import type { StatFilterInput } from '~/server/schema'
  import {
    getStatLabel,
    beneficiaryAccommodationZoneKeys
  } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const accommodationZoneStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getAccommodationZoneStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    accommodationZoneStats.value =
      data.map(({ _count, accommodationZone }) => ({
        key: accommodationZone || 'null',
        label: getStatLabel(
          beneficiaryAccommodationZoneKeys.byKey,
          accommodationZone
        ),
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
