<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des départements n'ont pas pu être chargées."
  />

  <template v-else-if="departmentsStats && departmentsStats.length">
    <StatsList
      :total-count="beneficiaryCount"
      :stats="departmentsStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.Department
        })
      "
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des départements.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getDepartmentStats.useQuery(
      toRef(() => props.filters)
    )

  const departmentsStats = computed(
    () =>
      data.value?.map(({ _count, department }) => ({
        key: department || 'null',
        label: department || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
