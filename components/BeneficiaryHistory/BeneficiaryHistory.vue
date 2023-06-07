<template>
  <div>
    <BeneficiaryHistoryFilters @filter="filters = $event" />
    <hr />
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="L'historique du bénéficiaire n'a pas pu être chargé."
    />
    <template v-else-if="history">
      <template v-if="!history.length">
        <p v-if="!filters">
          Créez une synthèse d'entretien pour commencer à alimenter l'historique
          du bénéficiaire.
        </p>
        <p v-else>Aucun résultat ne correspond aux filtres sélectionnés.</p>
      </template>
      <template v-else>
        <p class="fr-mb-2w fr-hint-text">
          {{ history.length }} élément(s) de l'historique du bénéficiaire
          affiché(s)
        </p>
        <ul class="history-list">
          <BeneficiaryHistoryDetails
            v-for="historyItem in history"
            :key="historyItem.id"
            :history="historyItem"
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
  import { GetBeneficiaryHistoryOutput, ErrorOutput } from '~/server/routers'

  // const { $focusAndScrollTo } = useNuxtApp()
  const filtersStore = useFiltersStore()
  // const route = useRoute()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const filters = ref(filtersStore.beneficiaryHistory || {})

  const {
    data: history,
    pending,
    error,
    refresh
  } = await useAsyncData<GetBeneficiaryHistoryOutput, ErrorOutput>(
    () =>
      useTrpcClient().beneficiary.getBeneficiaryHistory.query({
        beneficiaryId: props.beneficiaryId,
        filters: filters.value
      }),
    {
      watch: [filters]
    }
  )

  // TODO
  // watch(
  //   [pending, error, () => route.query.tab, () => route.query.item],
  //   async ([_pending, _error, tab, item]) => {
  //     if (_pending || _error) {
  //       return
  //     }

  //     await nextTick()

  //     if (tab === BeneficiaryTab.History && item) {
  //       $focusAndScrollTo(`#history-${item}`)
  //     }
  //   },
  //   { deep: true }
  // )

  function onHistoryItemDeleted() {
    refresh()
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .history-list {
    @include dsfr.disable-list-style;

    > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
