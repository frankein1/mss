<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des départements ou services de l'administration centrale n'ont pas pu être chargées."
  />

  <StatsList
    v-if="ministereDepartementServiceAcStats"
    :total-count="beneficiaryCount"
    :stats="ministereDepartementServiceAcStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled:
          FilterBeneficiaryNotFilled.BeneficiaryMinistereDepartementServiceAc
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des départements ou
    services de l'administration centrale.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import type { StatFilterInput } from '~/server/schema'
  import {
    ministereDepartmentServiceAcKeys,
    getStatLabel
  } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const ministereDepartementServiceAcStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereDepartementServiceAc.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    ministereDepartementServiceAcStats.value =
      data.map(({ _count, ministereDepartementServiceAc }) => ({
        key: ministereDepartementServiceAc || 'null',
        label: getStatLabel(
          ministereDepartmentServiceAcKeys.byKey,
          ministereDepartementServiceAc
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
