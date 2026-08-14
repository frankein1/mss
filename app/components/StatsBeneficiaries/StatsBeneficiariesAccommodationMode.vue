<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des modes d'hébergement n'ont pas pu être chargées."
  />
  <template
    v-else-if="accommodationModesStats && accommodationModesStats.length"
  >
    <StatsList
      :total-count="beneficiaryCount"
      :stats="accommodationModesStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.BeneficiaryAccommodationMode
        })
      "
  /></template>
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
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import {
    getStatLabel,
    beneficiaryAccommodationModeKeys
  } from '~~/client/options'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getAccommodationModeStats.useQuery(
      toRef(() => props.filters)
    )

  const accommodationModesStats = computed(
    () =>
      data.value?.map(({ _count, accommodationMode }) => ({
        key: accommodationMode || 'null',
        label: getStatLabel(
          beneficiaryAccommodationModeKeys.byKey,
          accommodationMode
        ),
        count: _count
      })) || []
  )
</script>
