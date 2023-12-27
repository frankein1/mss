<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des départements n'ont pas pu être chargées."
    />
    <template v-else-if="departmentsStats">
      <h2 class="fr-h5">Départements</h2>
      <StatsList
        v-if="departmentsStats.length"
        :total-count="beneficiaryCount"
        :stats="departmentsStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="RoutePath.AppBeneficiariesAdd()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des
        départements.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { STATS_NULL_LABEL } from '~/client/options/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: departmentsCounts,
    pending,
    error
  } = await trpcClient.stat.getDepartmentStats.useQuery(props.filters)

  const departmentsStats = computed(
    () =>
      departmentsCounts.value?.map(({ _count, department }) => ({
        key: department || 'null',
        label: department || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
