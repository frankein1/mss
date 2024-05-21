<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      :message="`Les statistiques du nombre de bénéficiaires concernés n'ont pas pu être chargées.`"
    />
    <template v-else-if="beneficiaryCounts !== null">
      <h2 class="fr-h5">Nombre de bénéficiaires concernés</h2>
      <StatsNumber
        v-if="beneficiaryCounts"
        :total-count="totalCount"
        :stats="beneficiaryCounts"
      />
      <p v-else>
        Commencez à créer des entretiens dans les fiches de bénéficiaires pour
        voir apparaître les statistiques du nombre de bénéficiaires concernés.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: beneficiaryCounts,
    error,
    pending
  } = await trpcClient.stat.getFollowupBeneficiaryNumber.useQuery(props.filters)
</script>

<style scoped>
  h2 {
    word-break: break-word;
  }
</style>
