<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques des demandes de logement n'ont pas pu être chargées."
    />
    <template v-else-if="data">
      <h2 class="fr-h5">Demandes de logement</h2>
      <p>
        Ces données prennent en compte uniquement les instructions de dossiers
        réalisées après le 31 décembre 2023 via le formulaire de demande de
        logement.
      </p>
      <!-- TODO: context stats -->
      <!-- <StatsList
        :total-count="totalCount"
        :stats="prescribingOrganizationStats"
        /> -->
      <p class="fr-text--bold">Motif des demandes de logement :</p>
      <!-- TODO: reason stats -->
      <!-- <StatsList
        :total-count="totalCount"
        :stats="prescribingOrganizationStats"
      /> -->
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const { data, pending, error } =
    await trpcClient.stat.getHousingHelpRequestsStats.useQuery(props.filters)

  // const financialHelpRequestTotalAmount = computed(
  //   () => data.value?.financialHelpRequestTotalAmount || 0
  // )

  // const financialHelpRequestsAmountByType = computed(
  //   () =>
  //     data.value?.financialHelpRequestAmountByType.map(
  //       ({ type, allocatedAmount }) => ({
  //         key: type.id,
  //         label: type.name,
  //         color: '#E4794A',
  //         count: allocatedAmount
  //       })
  //     ) || []
  // )
</script>
