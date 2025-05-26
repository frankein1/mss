<template>
  <div>
    <section class="feature-section fr-mb-4w">
      <h3 class="fr-sr-only">Filtres</h3>
      <BeneficiaryHistoryFilters
        v-model:values="socialSupportsFilters"
        :results-label="resultsLabel"
        :family-file-id="familyFileId"
        :family-file-identification="familyFileIdentification"
      />
    </section>
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="L'historique du bénéficiaire n'a pas pu être chargé."
    />
    <template v-else-if="items">
      <template v-if="!items.length">
        <p v-if="!socialSupportsFilters">
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
              :single-beneficiary="
                (familyFileIdentification || []).length === 1
              "
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
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { FamilyFileHistoryFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()
  const { familyFileId, familyFilePermissions, familyFileIdentification } =
    defineProps<{
      familyFileId: string
      familyFilePermissions: FamilyFilePermissions
      familyFileIdentification: BeneficiaryFileIdentification[]
    }>()
  const socialSupportsFilters = ref<FamilyFileHistoryFilterInput>({})

  const socialSupportsQueryInput = computed(() => ({
    familyFileId,
    filters: socialSupportsFilters.value
  }))
  const { data: socialSupports, error } =
    await trpcClient.file.getSocialSupports.useQuery(socialSupportsQueryInput, {
      queryKey: 'getFamilyFile.history'
    })

  const emit = defineEmits<{ refresh: [] }>()

  const items = computed(() => socialSupports.value?.items || [])

  const totalCount = computed(() => socialSupports.value?.totalCount || 0)

  const resultsLabel = computed(() => {
    const plural = items.value.length > 1 ? 's' : ''

    if (items.value.length === totalCount.value) {
      return `${items.value.length} accompagnement${plural}`
    }

    return `${items.value.length} accompagnement${plural} affiché${plural} sur ${totalCount.value}`
  })

  function onHistoryItemDeleted(socialSupportId: string) {
    if (!socialSupports.value) {
      return
    }
    socialSupports.value.totalCount--
    socialSupports.value.items = socialSupports.value.items.filter(
      ({ data: { id } }) => id !== socialSupportId
    )
    emit('refresh')
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/dsfr/core/index' as dsfr;

  .history-list {
    @include dsfr.disable-list-style;

    > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
