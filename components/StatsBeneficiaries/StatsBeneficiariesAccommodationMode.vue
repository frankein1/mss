<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des modes d'hébergement n'ont pas pu être chargées."
  />
  <StatsList
    v-if="accommodationModesStats"
    :total-count="beneficiaryCount"
    :stats="accommodationModesStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryAccommodationMode
      })
    "
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

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import {
    getStatLabel,
    beneficiaryAccommodationModeKeys
  } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const accommodationModesStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getAccommodationModeStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    accommodationModesStats.value =
      data.map(({ _count, accommodationMode }) => ({
        key: accommodationMode || 'null',
        label: getStatLabel(
          beneficiaryAccommodationModeKeys.byKey,
          accommodationMode
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
