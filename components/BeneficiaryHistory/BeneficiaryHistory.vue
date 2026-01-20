<template>
  <div>
    <section class="feature-section fr-mb-4w">
      <h3 class="fr-sr-only">Filtres</h3>
      <BeneficiaryHistoryFilters
        v-model:values="socialSupportsFilters"
        :results-label="resultsLabel"
        :family-file-identification="familyFileIdentification"
      />
    </section>
    <AtomAlert
      v-if="rdvspAuthStatus === 'no_account'"
      :alert-type="AlertType.Error"
      closeable
      message="Connexion à RDVSP impossible"
      ><template #detailedMessage
        ><p>
          Vous n'avez pas de compte RDVSP, vous ne pouvez donc pas voir les
          rendez-vous déjà pris ni en prendre de nouveaux. Rapprochez-vous de
          votre responsable de structure pour activer votre compte
        </p>
      </template></AtomAlert
    >
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
              :key="item.id"
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
  import type { FamilyFilePermissions } from '~/server/security'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import type { SocialSupportFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()
  const { familyFileId, familyFilePermissions, familyFileIdentification } =
    defineProps<{
      familyFileId: string
      familyFilePermissions: FamilyFilePermissions
      familyFileIdentification: BeneficiaryFileIdentification[]
    }>()
  const socialSupportsFilters = ref<SocialSupportFilterInput>({})

  const socialSupportsQueryInput = computed(() => ({
    familyFileId,
    filters: socialSupportsFilters.value
  }))
  const { data: socialSupports, error } =
    await trpcClient.file.getSocialSupports.useQuery(socialSupportsQueryInput, {
      queryKey: 'getFamilyFile.history'
    })
  const { data: rdvspAuthStatus } =
    await trpcClient.rdvsp.getAuthStatus.useQuery()

  const emit = defineEmits<{ refresh: [] }>()

  const items = computed(() => socialSupports.value ?? [])

  const resultsLabel = computed(() => {
    const plural = items.value.length > 1 ? 's' : ''
    return `${items.value.length} accompagnement${plural}`
  })

  function onHistoryItemDeleted(socialSupportId: string) {
    if (!socialSupports.value) {
      return
    }
    socialSupports.value = socialSupports.value.filter(
      ({ id }) => id !== socialSupportId
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

  .fr-alert {
    margin-bottom: 2rem;
  }
</style>
