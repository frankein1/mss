<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des départements ou services de l'administration centrale n'ont pas pu être chargées."
  />

  <template
    v-else-if="
      ministereDepartementServiceAcStats &&
      ministereDepartementServiceAcStats.length
    "
  >
    <StatsList
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
  </template>
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

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getMinistereDepartementServiceAc.useQuery(
      toRef(() => props.filters)
    )
  const ministereDepartementServiceAcStats = computed(
    () =>
      data.value?.map(({ _count, ministereDepartementServiceAc }) => ({
        key: ministereDepartementServiceAc || 'null',
        label: getStatLabel(
          ministereDepartmentServiceAcKeys.byKey,
          ministereDepartementServiceAc
        ),
        count: _count
      })) || []
  )
</script>
