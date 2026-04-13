<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des interpellations des ministres n'ont pas pu être chargées."
  />
  <template
    v-else-if="
      ministereInterpellationStats && ministereInterpellationStats.length
    "
  >
    <StatsList
      :total-count="beneficiaryCount"
      :stats="ministereInterpellationStats"
      stats-bar
      :stats-percentage="false"
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des interpellations
    des ministres.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import type { StatFilterInput } from '~/server/schema'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getMinistereInterpellation.useQuery(
      toRef(() => props.filters)
    )
  const ministereInterpellationStats = computed(
    () =>
      data.value?.map(({ _count, minister }) => ({
        key: minister,
        label: minister,
        count: _count
      })) || []
  )
</script>
