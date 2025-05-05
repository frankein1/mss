<template>
  <div class="feature-section fr-p-2w">
    <h4>Nombre de dossiers concernés</h4>
    <AtomLoader
      v-if="status === 'pending'"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques du nombre de foyers concernés n'ont pas pu être chargées."
    />
    <template v-else-if="data !== null">
      <StatsBeneficiaryNumber
        v-if="data.beneficiary"
        :beneficiary-counts="data.beneficiary"
        :history-type
        :family-counts="data.family"
      />
      <p v-else>
        Commencez à créer des instructions de dossier dans les fiches de
        bénéficiaires pour voir apparaître les statistiques du nombre de
        bénéficiaires concernés.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: StatFilterInput
    historyType?: 'beneficiary'
  }>()

  const { data, error, status } =
    await trpcClient.stat.getFamilyFileCount.useQuery(props.filters)
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-pink.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: break-word;
  }
</style>
