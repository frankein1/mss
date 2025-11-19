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
    <template v-else-if="beneficiaryCount !== null">
      <StatsBeneficiaryNumber
        v-if="beneficiaryCount"
        :beneficiary-counts="beneficiaryCount"
        :family-counts="familyFileCount"
        :history-type
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
  import type { StatFilterInput } from '~/server/schema'

  const props = defineProps<{
    filters: StatFilterInput
    historyType?: 'beneficiary'
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getFamilyFileCount.useQuery(
      toRef(() => props.filters)
    )
  const beneficiaryCount = computed(() => data.value?.beneficiary)
  const familyFileCount = computed(() => data.value?.family)
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-pink.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
