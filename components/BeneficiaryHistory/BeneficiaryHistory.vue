<template>
  <div>
    <section class="feature-section fr-mb-4w">
      <h3 class="fr-sr-only">Filtres</h3>
      <BeneficiaryHistoryFilters
        v-model:values="filters"
        :results-label="resultsLabel"
        :family-file-id="familyFileId"
      />
    </section>
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
        <section>
          <h3 class="fr-sr-only">Liste des accompagnements</h3>
          <ul class="history-list">
            <BeneficiaryHistoryDetails
              v-for="item in items"
              :key="item.data.id"
              :item="item"
              :family-file-permissions="familyFilePermissions"
              @deleted="onHistoryItemDeleted"
            />
          </ul>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { FamilyFilePermissions } from '~/server/security'
  import { FamilyFileHistoryFilterInput } from '~/server/schema'
  // import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    familyFileId: string
    // familyFileIdentification: BeneficiaryFileIdentification[]
    familyFilePermissions: FamilyFilePermissions
  }>()

  const filters = defineModel<FamilyFileHistoryFilterInput>({ default: {} })

  const queryInput = computed(() => ({
    familyFileId: props.familyFileId,
    filters: filters.value
  }))

  const { data, pending, error } =
    await useTrpcClient().file.getSocialSupports.useQuery(queryInput)

  const items = computed(() => data.value?.items || [])

  const totalCount = computed(() => data.value?.totalCount || 0)

  const resultsLabel = computed(() => {
    const plural = items.value.length > 1 ? 's' : ''

    if (items.value.length === totalCount.value) {
      return `${items.value.length} accompagnement${plural}`
    }

    return `${items.value.length} accompagnement${plural} affiché${plural} sur ${totalCount.value}`
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

  .history-list {
    @include dsfr.disable-list-style;

    > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
