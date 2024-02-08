<template>
  <div>
    <div class="feature-section history-header-section fr-p-3w">
      <BeneficiaryHistoryFilters
        v-model:values="filters"
        :results-label="resultsLabel"
        :beneficiary-id="beneficiaryId"
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
    <template v-else-if="items">
      <template v-if="!items.length">
        <p v-if="!filters">
          Créez une synthèse d'entretien pour commencer à alimenter l'historique
          du bénéficiaire.
        </p>
        <p v-else>Aucun résultat ne correspond aux filtres sélectionnés.</p>
      </template>
      <template v-else>
        <ul class="history-list">
          <BeneficiaryHistoryDetails
            v-for="item in items"
            :key="item.data.id"
            :item="item"
            :beneficiary-permissions="beneficiaryPermissions"
            @deleted="onHistoryItemDeleted"
          />
        </ul>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
  import { BeneficiaryPermissions } from '~/server/security'
  import { BeneficiaryHistoryFilterInput } from '~/server/schema'

  const route = useRoute()

  const props = defineProps<{
    beneficiaryId: string
    beneficiaryPermissions: BeneficiaryPermissions
  }>()

  const filters = defineModel<BeneficiaryHistoryFilterInput>({ default: {} })

  const queryInput = computed(() => ({
    beneficiaryId: props.beneficiaryId,
    filters: filters.value
  }))

  const { data, pending, error } =
    await useTrpcClient().beneficiary.getSocialSupports.useQuery(queryInput)

  const items = computed(() => data.value?.items || [])

  const totalCount = computed(() => data.value?.totalCount || 0)

  const resultsLabel = computed(() => {
    const plural = items.value.length > 1 ? 's' : ''

    if (items.value.length === totalCount.value) {
      return `${items.value.length} accompagnement${plural}`
    }

    return `${items.value.length} accompagnement${plural} affiché${plural} sur ${totalCount.value}`
  })

  onMounted(async () => {
    const tab = route.hash.slice(1)
    const { item } = route.query

    if (tab === BeneficiaryTab.History && item) {
      await nextTick()

      focusAndScrollTo(`#history-${item}`)
    }
  })

  function onHistoryItemDeleted(socialSupportId: string) {
    if (!data.value) {
      return
    }
    data.value.totalCount--
    data.value.items = data.value.items.filter(
      ({ data: { id } }) => id !== socialSupportId
    )
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
