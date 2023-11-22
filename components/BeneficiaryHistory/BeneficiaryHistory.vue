<template>
  <div>
    <div class="feature-section history-header-section fr-p-3w">
      <BeneficiaryHistoryFilters
        :results-label="`${histories.length} élément(s) affiché(s) sur ${historyTotal} disponible(s) dans l'historique des accompagnements du bénéficiaire`"
        :beneficiary-id="beneficiaryId"
        @filter="filters = $event"
      />
    </div>
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="L'historique du bénéficiaire n'a pas pu être chargé."
    />
    <template v-else-if="histories">
      <template v-if="!histories.length">
        <p v-if="!filters">
          Créez une synthèse d'entretien pour commencer à alimenter l'historique
          du bénéficiaire.
        </p>
        <p v-else>Aucun résultat ne correspond aux filtres sélectionnés.</p>
      </template>
      <template v-else>
        <ul class="history-list">
          <BeneficiaryHistoryDetails
            v-for="history in histories"
            :key="history.id"
            :history="history"
            @deleted="onHistoryItemDeleted"
          />
        </ul>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useFiltersStore } from '~/store/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'

  const filtersStore = useFiltersStore()
  const route = useRoute()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const filters = ref(filtersStore.beneficiaryHistory || {})

  const queryInput = computed(() => ({
    beneficiaryId: props.beneficiaryId,
    filters: filters.value
  }))

  const { data, pending, error, refresh } =
    await useTrpcClient().beneficiary.getBeneficiaryHistories.useQuery(
      queryInput
    )

  const histories = computed(() => data.value?.histories || [])

  const historyTotal = computed(() => data.value?.totalCount || 0)

  onMounted(async () => {
    const tab = route.hash.slice(1)
    const { item } = route.query

    if (tab === BeneficiaryTab.History && item) {
      await nextTick()

      focusAndScrollTo(`#history-${item}`)
    }
  })

  function onHistoryItemDeleted() {
    refresh()
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .history-header-section {
    margin-bottom: 2rem;
  }

  .history-list {
    @include dsfr.disable-list-style;

    > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
