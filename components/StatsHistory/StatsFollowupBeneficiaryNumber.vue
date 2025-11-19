<template>
  <div class="feature-section fr-p-2w">
    <h4 class="fr-sr-only">Nombre de bénéficiaires concernés</h4>
    <AtomLoader
      v-if="status === 'pending'"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques du nombre de bénéficiaires concernés n'ont pas pu être chargées."
    />
    <template v-else-if="beneficiaryFollowupCounts !== null">
      <StatsBeneficiaryNumber
        v-if="beneficiaryFollowupCounts"
        :beneficiary-counts="beneficiaryFollowupCounts"
        :history-type
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
  import type { StatFilterInput } from '~/server/schema'

  const props = defineProps<{
    filters: StatFilterInput
    historyType?: 'followup'
  }>()

  const trpcClient = useTrpcClient()

  const {
    data: beneficiaryFollowupCounts,
    error,
    status
  } = await trpcClient.stat.getFollowupBeneficiaryNumber.useQuery(
    toRef(() => props.filters)
  )
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-teal.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
